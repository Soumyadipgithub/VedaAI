import type { Job } from "bullmq";
import { AssignmentModel } from "../db/Assignment.js";
import { getGenAI, getGeminiModel } from "../llm/client.js";
import { buildPrompt } from "../llm/prompt.js";
import { parseLLMResponse } from "../llm/parser.js";
import { publishJobEvent } from "../queue/redis.js";

interface JobData {
  assignmentId: string;
  input: {
    dueDate: string;
    questionTypes: string[];
    numberOfQuestions: number;
    totalMarks: number;
    additionalInstructions?: string;
    uploadedText?: string;
    title?: string;
  };
}

export async function assignmentProcessor(job: Job<JobData>): Promise<void> {
  const { assignmentId, input } = job.data;
  console.log(`[worker] processing job ${job.id} assignmentId=${assignmentId}`);

  await AssignmentModel.findByIdAndUpdate(assignmentId, { status: "processing" });
  await publishJobEvent({ jobId: job.id, assignmentId, status: "processing" });

  const prompt = buildPrompt(input);
  let rawText: string;

  try {
    const response = await getGenAI().models.generateContent({
      model: getGeminiModel(),
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "object",
          properties: {
            sections: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  instruction: { type: "string" },
                  questions: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        text: { type: "string" },
                        difficulty: { type: "string", enum: ["easy", "moderate", "hard"] },
                        marks: { type: "integer" },
                      },
                      required: ["text", "difficulty", "marks"],
                    },
                  },
                },
                required: ["title", "instruction", "questions"],
              },
            },
          },
          required: ["sections"],
        },
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    });
    rawText = response.text ?? "";
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error(`[worker] LLM call failed for job ${job.id}:`, msg);
    await AssignmentModel.findByIdAndUpdate(assignmentId, { status: "failed", error: msg });
    await publishJobEvent({ jobId: job.id, assignmentId, status: "failed", error: msg });
    throw e;
  }

  let paper;
  try {
    paper = parseLLMResponse(rawText);
  } catch (parseErr) {
    console.error(`[worker] first parse failed, retrying with plain text for job ${job.id}`);
    try {
      const retryResponse = await getGenAI().models.generateContent({
        model: getGeminiModel(),
        contents: `${prompt}\n\nIMPORTANT: Your previous response could not be parsed. Return ONLY the raw JSON object, nothing else.`,
        config: { responseMimeType: "application/json", maxOutputTokens: 4096 },
      });
      paper = parseLLMResponse(retryResponse.text ?? "");
    } catch (retryErr) {
      const msg = retryErr instanceof Error ? retryErr.message : String(retryErr);
      await AssignmentModel.findByIdAndUpdate(assignmentId, { status: "failed", error: msg });
      await publishJobEvent({ jobId: job.id, assignmentId, status: "failed", error: msg });
      throw retryErr;
    }
  }

  const updatedDoc = await AssignmentModel.findByIdAndUpdate(
    assignmentId,
    { status: "done", sections: paper.sections, error: undefined },
    { new: true },
  ).lean();

  await publishJobEvent({
    jobId: job.id,
    assignmentId,
    status: "done",
    assignment: {
      id: assignmentId,
      status: "done",
      input,
      sections: paper.sections,
      createdAt: (updatedDoc as { createdAt?: Date })?.createdAt?.toISOString() ?? "",
      updatedAt: new Date().toISOString(),
    },
  });

  console.log(`[worker] job ${job.id} done — ${paper.sections.length} sections generated`);
}

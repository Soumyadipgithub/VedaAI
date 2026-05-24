import { Router } from "express";
import type { Request, Response } from "express";
import { z } from "zod";
import { AssignmentModel } from "../db/Assignment.js";
import { enqueueAssignment } from "../queue/producer.js";
import { upload } from "../middleware/upload.js";

const router = Router();

function docToAssignment(doc: Record<string, unknown>) {
  return {
    id: (doc._id as { toString: () => string }).toString(),
    status: doc.status,
    input: doc.input,
    sections: doc.sections,
    error: doc.error,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

router.get("/", async (_req: Request, res: Response) => {
  const docs = await AssignmentModel.find().sort({ createdAt: -1 }).lean();
  res.json(docs.map((d) => docToAssignment(d as Record<string, unknown>)));
});

router.delete("/:id", async (req: Request, res: Response) => {
  const doc = await AssignmentModel.findByIdAndDelete(req.params["id"]);
  if (!doc) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json({ ok: true });
});

const FormInputSchema = z.object({
  title: z.string().max(200).optional(),
  schoolName: z.string().max(200).optional(),
  subject: z.string().max(100).optional(),
  grade: z.string().max(50).optional(),
  timeAllowed: z.coerce.number().int().positive().max(600).optional(),
  dueDate: z.string().min(1, "Due date is required"),
  questionTypes: z.preprocess(
    (v) => {
      if (typeof v === "string") {
        try {
          return JSON.parse(v);
        } catch {
          return v.split(",").map((s) => s.trim());
        }
      }
      return v;
    },
    z
      .array(
        z.enum([
          "multiple_choice",
          "short_answer",
          "long_answer",
          "true_false",
          "fill_blanks",
        ]),
      )
      .min(1, "At least one question type is required"),
  ),
  numberOfQuestions: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .positive("Number of questions must be positive")
    .max(100),
  totalMarks: z.coerce
    .number({ invalid_type_error: "Must be a number" })
    .int()
    .positive("Total marks must be positive")
    .max(1000),
  additionalInstructions: z.string().max(2000).optional(),
});

router.post("/", upload.single("file"), async (req: Request, res: Response) => {
  const parsed = FormInputSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ errors: parsed.error.flatten() });
    return;
  }

  let uploadedText: string | undefined;
  if (req.file) {
    if (req.file.mimetype === "text/plain") {
      uploadedText = req.file.buffer.toString("utf8");
    } else if (req.file.mimetype === "application/pdf") {
      try {
        const pdfParse = (await import("pdf-parse")).default;
        const result = await pdfParse(req.file.buffer);
        uploadedText = result.text;
      } catch {
        uploadedText = undefined;
      }
    }
  }

  const input = { ...parsed.data, uploadedText };
  const doc = await AssignmentModel.create({ status: "pending", input, sections: [] });
  const assignmentId = (doc._id as { toString: () => string }).toString();

  const jobId = await enqueueAssignment({ assignmentId, input });

  res.status(201).json({ jobId, assignmentId });
});

router.get("/:id", async (req: Request, res: Response) => {
  const doc = await AssignmentModel.findById(req.params["id"]).lean();
  if (!doc) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  res.json(docToAssignment(doc as Record<string, unknown>));
});

router.post("/:id/regenerate", async (req: Request, res: Response) => {
  const doc = await AssignmentModel.findById(req.params["id"]);
  if (!doc) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  await AssignmentModel.findByIdAndUpdate(req.params["id"], {
    status: "pending",
    sections: [],
    error: undefined,
  });

  const jobId = await enqueueAssignment({
    assignmentId: req.params["id"]!,
    input: doc.input as Record<string, unknown>,
  });

  res.json({ jobId, assignmentId: req.params["id"] });
});

router.get("/:id/pdf", async (req: Request, res: Response) => {
  const doc = await AssignmentModel.findById(req.params["id"]).lean();
  if (!doc) {
    res.status(404).json({ error: "Not found" });
    return;
  }
  if (doc.status !== "done" || !doc.sections?.length) {
    res.status(400).json({ error: "Assignment not ready for PDF" });
    return;
  }

  try {
    const { generatePDF } = await import("../services/pdf.js");
    const stream = await generatePDF(doc as Parameters<typeof generatePDF>[0]);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="assignment-${req.params["id"]}.pdf"`,
    );
    stream.pipe(res);
  } catch (e) {
    console.error("[pdf]", e);
    res.status(500).json({ error: "PDF generation failed" });
  }
});

export default router;

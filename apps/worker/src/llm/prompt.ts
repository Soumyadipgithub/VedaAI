interface PromptInput {
  title?: string;
  schoolName?: string;
  subject?: string;
  grade?: string;
  timeAllowed?: number;
  dueDate: string;
  questionTypes: string[];
  numberOfQuestions: number;
  totalMarks: number;
  additionalInstructions?: string;
  uploadedText?: string;
}

function formatQuestionTypes(types: string[]): string {
  const labels: Record<string, string> = {
    multiple_choice: "Multiple Choice Questions (MCQ)",
    short_answer: "Short Answer Questions",
    long_answer: "Long Answer / Essay Questions",
    true_false: "True or False",
    fill_blanks: "Fill in the Blanks",
  };
  return types.map((t) => labels[t] ?? t).join(", ");
}

export function buildPrompt(input: PromptInput): string {
  const sections = Math.min(Math.max(Math.ceil(input.questionTypes.length), 1), 4);
  const questionsPerSection = Math.ceil(input.numberOfQuestions / sections);
  const marksPerSection = Math.ceil(input.totalMarks / sections);

  return `You are an expert academic assessment designer. Generate a structured question paper based on the following requirements.

Assignment Title: ${input.title ?? "Assessment"}
${input.schoolName ? `School: ${input.schoolName}` : ""}
${input.subject ? `Subject: ${input.subject}` : ""}
${input.grade ? `Class/Grade: ${input.grade}` : ""}
${input.timeAllowed ? `Time Allowed: ${input.timeAllowed} minutes` : ""}
Due Date: ${input.dueDate}
Question Types: ${formatQuestionTypes(input.questionTypes)}
Total Number of Questions: ${input.numberOfQuestions}
Total Marks: ${input.totalMarks}
${input.additionalInstructions ? `Additional Instructions: ${input.additionalInstructions}` : ""}
${input.uploadedText ? `Reference Material:\n---\n${input.uploadedText.slice(0, 3000)}\n---` : ""}

Create ${sections} section(s) with approximately ${questionsPerSection} questions each and ${marksPerSection} marks per section.

Assign difficulty levels appropriately: use "easy" for straightforward recall, "moderate" for application, "hard" for analysis/synthesis.

Return ONLY valid JSON matching this schema (no markdown, no explanation):
{
  "sections": [
    {
      "title": "Section A",
      "instruction": "Attempt all questions. Each question carries N marks.",
      "questions": [
        {
          "text": "Full question text here",
          "difficulty": "easy" | "moderate" | "hard",
          "marks": number
        }
      ]
    }
  ]
}`;
}

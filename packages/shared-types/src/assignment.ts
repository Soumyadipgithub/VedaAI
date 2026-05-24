import { z } from "zod";

export const DifficultySchema = z.enum(["easy", "moderate", "hard"]);
export type Difficulty = z.infer<typeof DifficultySchema>;

export const QuestionSchema = z.object({
  text: z.string().min(1),
  difficulty: DifficultySchema,
  marks: z.number().int().nonnegative(),
});
export type Question = z.infer<typeof QuestionSchema>;

export const SectionSchema = z.object({
  title: z.string().min(1),
  instruction: z.string().min(1),
  questions: z.array(QuestionSchema).min(1),
});
export type Section = z.infer<typeof SectionSchema>;

export const QuestionTypeSchema = z.enum([
  "multiple_choice",
  "short_answer",
  "long_answer",
  "true_false",
  "fill_blanks",
]);
export type QuestionType = z.infer<typeof QuestionTypeSchema>;

export const AssignmentStatusSchema = z.enum([
  "pending",
  "processing",
  "done",
  "failed",
]);
export type AssignmentStatus = z.infer<typeof AssignmentStatusSchema>;

export const AssignmentInputSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  schoolName: z.string().max(200).optional(),
  subject: z.string().max(100).optional(),
  grade: z.string().max(50).optional(),
  timeAllowed: z.number().int().positive().max(600).optional(),
  dueDate: z.string().datetime().or(z.string().min(1)),
  questionTypes: z.array(QuestionTypeSchema).min(1),
  numberOfQuestions: z.number().int().positive().max(100),
  totalMarks: z.number().int().positive().max(1000),
  additionalInstructions: z.string().max(2000).optional(),
  uploadedText: z.string().optional(),
});
export type AssignmentInput = z.infer<typeof AssignmentInputSchema>;

export const AssignmentSchema = z.object({
  id: z.string(),
  status: AssignmentStatusSchema,
  input: AssignmentInputSchema,
  sections: z.array(SectionSchema).default([]),
  error: z.string().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export type Assignment = z.infer<typeof AssignmentSchema>;

export const GeneratedPaperSchema = z.object({
  sections: z.array(SectionSchema).min(1),
});
export type GeneratedPaper = z.infer<typeof GeneratedPaperSchema>;

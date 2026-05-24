import mongoose, { Schema, type Document } from "mongoose";
import type { Assignment } from "@veda/shared-types";

export type AssignmentDoc = Omit<Assignment, "id" | "createdAt" | "updatedAt"> &
  Document & { _id: mongoose.Types.ObjectId };

const QuestionSchema = new Schema(
  {
    text: { type: String, required: true },
    difficulty: { type: String, enum: ["easy", "moderate", "hard"], required: true },
    marks: { type: Number, required: true },
  },
  { _id: false },
);

const SectionSchema = new Schema(
  {
    title: { type: String, required: true },
    instruction: { type: String, required: true },
    questions: { type: [QuestionSchema], required: true },
  },
  { _id: false },
);

const AssignmentInputSchema = new Schema(
  {
    title: String,
    schoolName: String,
    subject: String,
    grade: String,
    timeAllowed: Number,
    dueDate: { type: String, required: true },
    questionTypes: [String],
    numberOfQuestions: { type: Number, required: true },
    totalMarks: { type: Number, required: true },
    additionalInstructions: String,
    uploadedText: String,
  },
  { _id: false },
);

const AssignmentSchema = new Schema(
  {
    status: {
      type: String,
      enum: ["pending", "processing", "done", "failed"],
      default: "pending",
    },
    input: { type: AssignmentInputSchema, required: true },
    sections: { type: [SectionSchema], default: [] },
    error: String,
  },
  { timestamps: true },
);

export const AssignmentModel = (
  mongoose.models["Assignment"] as mongoose.Model<AssignmentDoc> | undefined
) ?? mongoose.model<AssignmentDoc>("Assignment", AssignmentSchema);

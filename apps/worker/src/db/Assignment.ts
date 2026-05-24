import mongoose, { Schema } from "mongoose";

const QuestionSchema = new Schema(
  { text: String, difficulty: String, marks: Number },
  { _id: false },
);
const SectionSchema = new Schema(
  { title: String, instruction: String, questions: [QuestionSchema] },
  { _id: false },
);
const AssignmentInputSchema = new Schema(
  {
    title: String,
    dueDate: String,
    questionTypes: [String],
    numberOfQuestions: Number,
    totalMarks: Number,
    additionalInstructions: String,
    uploadedText: String,
  },
  { _id: false },
);

const AssignmentSchema = new Schema(
  {
    status: { type: String, default: "pending" },
    input: AssignmentInputSchema,
    sections: { type: [SectionSchema], default: [] },
    error: String,
  },
  { timestamps: true },
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const AssignmentModel: mongoose.Model<any> =
  (mongoose.models["Assignment"] as mongoose.Model<any> | undefined) ??
  mongoose.model("Assignment", AssignmentSchema);

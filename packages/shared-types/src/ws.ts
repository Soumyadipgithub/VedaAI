import { z } from "zod";
import { AssignmentSchema } from "./assignment.js";

export const WS_ROOM = (jobId: string) => `job:${jobId}` as const;

export const WSEventNameSchema = z.enum([
  "job:queued",
  "job:processing",
  "job:done",
  "job:failed",
  "job:resume",
]);
export type WSEventName = z.infer<typeof WSEventNameSchema>;

export const WSPayloadSchema = z.object({
  jobId: z.string(),
  assignmentId: z.string(),
  status: z.enum(["pending", "processing", "done", "failed"]),
  assignment: AssignmentSchema.optional(),
  error: z.string().optional(),
});
export type WSPayload = z.infer<typeof WSPayloadSchema>;

export interface WSResumePayload {
  jobId: string;
}

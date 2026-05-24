import { Queue } from "bullmq";
import { redisConnection } from "./redis.js";

export const assignmentQueue = new Queue("assignments", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 2,
    backoff: { type: "exponential", delay: 2000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 50 },
  },
});

export async function enqueueAssignment(payload: {
  assignmentId: string;
  input: Record<string, unknown>;
}): Promise<string> {
  const existing = await assignmentQueue.getJob(payload.assignmentId);
  if (existing) await existing.remove();
  const job = await assignmentQueue.add("generate", payload, { jobId: payload.assignmentId });
  return job.id!;
}

import Redis from "ioredis";

const REDIS_URL = process.env.REDIS_URL ?? "redis://localhost:6379";

export const redisConnection = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export const redisPub = new Redis(REDIS_URL, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false,
});

export async function publishJobEvent(payload: Record<string, unknown>): Promise<void> {
  await redisPub.publish("job-events", JSON.stringify(payload));
}

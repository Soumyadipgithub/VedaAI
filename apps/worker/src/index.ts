import { config as dotenvConfig } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const _dir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(_dir, "../../../.env") });
dotenvConfig();
import { Worker } from "bullmq";
import { connectDB } from "./db/connection.js";
import { redisConnection } from "./queue/redis.js";
import { assignmentProcessor } from "./processors/assignmentProcessor.js";

async function boot() {
  await connectDB();

  const worker = new Worker("assignments", assignmentProcessor, {
    connection: redisConnection,
    concurrency: 2,
  });

  worker.on("completed", (job) => {
    console.log(`[worker] job ${job.id} completed`);
  });
  worker.on("failed", (job, err) => {
    console.error(`[worker] job ${job?.id} failed:`, err.message);
  });
  worker.on("error", (err) => {
    console.error("[worker] error:", err.message);
  });

  console.log("[worker] listening on queue: assignments");

  const shutdown = async (signal: string) => {
    console.log(`[worker] received ${signal}, shutting down`);
    await worker.close();
    process.exit(0);
  };
  process.on("SIGINT", () => shutdown("SIGINT"));
  process.on("SIGTERM", () => shutdown("SIGTERM"));
}

boot().catch((e) => {
  console.error("[worker] boot failed:", e);
  process.exit(1);
});

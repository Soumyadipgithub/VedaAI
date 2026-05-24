import { config as dotenvConfig } from "dotenv";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
const _dir = dirname(fileURLToPath(import.meta.url));
dotenvConfig({ path: resolve(_dir, "../../../.env") });
dotenvConfig();
import { createServer } from "http";
import express from "express";
import cors from "cors";
import { Server as SocketIOServer } from "socket.io";
import { connectDB } from "./db/connection.js";
import { redisSub } from "./queue/redis.js";
import assignmentsRouter from "./routes/assignments.js";

const app = express();
const httpServer = createServer(app);
const PORT = Number(process.env.PORT ?? 4000);

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

const corsOptions = {
  origin: corsOrigins.length > 0 ? corsOrigins : true,
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "2mb" }));

const io = new SocketIOServer(httpServer, {
  cors: corsOptions,
  transports: ["websocket", "polling"],
});

io.on("connection", (socket) => {
  socket.on("job:join", ({ jobId }: { jobId: string }) => {
    socket.join(`job:${jobId}`);
  });
  socket.on("job:resume", async ({ jobId }: { jobId: string }) => {
    socket.join(`job:${jobId}`);
    try {
      const { AssignmentModel } = await import("./db/Assignment.js");
      const doc = await AssignmentModel.findById(jobId).lean();
      if (!doc) return;
      const status = (doc as unknown as { status: string }).status;
      const assignmentId = (doc._id as { toString: () => string }).toString();
      const basePayload = { jobId, assignmentId, status };
      if (status === "done") {
        socket.emit("job:done", {
          ...basePayload,
          assignment: {
            id: assignmentId,
            status: doc.status,
            input: doc.input,
            sections: doc.sections,
            createdAt: (doc as { createdAt?: Date }).createdAt,
            updatedAt: (doc as { updatedAt?: Date }).updatedAt,
          },
        });
      } else if (status === "failed") {
        socket.emit("job:failed", { ...basePayload, error: (doc as { error?: string }).error });
      }
    } catch {}
  });
});

redisSub.subscribe("job-events", (err) => {
  if (err) console.error("[redis-sub] subscribe error:", err);
  else console.log("[redis-sub] subscribed to job-events");
});

redisSub.on("message", (_channel: string, msg: string) => {
  try {
    const payload = JSON.parse(msg) as {
      jobId: string;
      status: string;
      [k: string]: unknown;
    };
    const event =
      payload.status === "done"
        ? "job:done"
        : payload.status === "failed"
          ? "job:failed"
          : "job:status";
    io.to(`job:${payload.jobId}`).emit(event, payload);
  } catch (e) {
    console.error("[redis-sub] message parse error:", e);
  }
});

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok", service: "api", time: new Date().toISOString() });
});

app.get("/", (_req, res) => {
  res.json({ service: "veda-ai-api", health: "/health" });
});

app.use("/api/assignments", assignmentsRouter);

app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction,
  ) => {
    console.error("[api] unhandled error:", err);
    res.status(500).json({ error: err.message ?? "Internal server error" });
  },
);

async function boot() {
  await connectDB();
  httpServer.listen(PORT, () => {
    console.log(`[api] listening on :${PORT}`);
  });
}

boot().catch((e) => {
  console.error("[api] boot failed:", e);
  process.exit(1);
});

import "dotenv/config";
import express from "express";
import cors from "cors";

const app = express();
const PORT = Number(process.env.PORT ?? 4000);

const corsOrigins = (process.env.CORS_ORIGINS ?? "http://localhost:3000")
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: corsOrigins.length > 0 ? corsOrigins : true,
    credentials: true,
  }),
);
app.use(express.json({ limit: "2mb" }));

app.get("/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    service: "api",
    time: new Date().toISOString(),
  });
});

app.get("/", (_req, res) => {
  res.status(200).json({
    service: "veda-ai-api",
    health: "/health",
  });
});

app.listen(PORT, () => {
  console.log(`[api] listening on :${PORT}`);
});

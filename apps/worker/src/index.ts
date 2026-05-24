import "dotenv/config";

const SERVICE = "worker";

function heartbeat() {
  console.log(
    `[${SERVICE}] alive ${new Date().toISOString()} — BullMQ subscription wired in Phase 2.`,
  );
}

console.log(`[${SERVICE}] boot — Node ${process.version}`);
heartbeat();
setInterval(heartbeat, 60_000);

const shutdown = (signal: string) => {
  console.log(`[${SERVICE}] received ${signal}, shutting down`);
  process.exit(0);
};
process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

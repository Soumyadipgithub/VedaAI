"use client";

import { io, type Socket } from "socket.io-client";
import type { Assignment } from "@veda/shared-types";

const WS_URL = process.env.NEXT_PUBLIC_WS_URL ?? "http://localhost:4000";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(WS_URL, {
      transports: ["websocket", "polling"],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
    });
    socket.on("connect", () => console.log("[ws] connected", socket?.id));
    socket.on("disconnect", (reason) => console.log("[ws] disconnected", reason));
    socket.on("connect_error", (e) => console.error("[ws] connect error", e.message));
  }
  return socket;
}

export function joinJobRoom(jobId: string): void {
  getSocket().emit("job:join", { jobId });
}

export function onJobDone(handler: (payload: { assignment: Assignment }) => void): () => void {
  const s = getSocket();
  s.on("job:done", handler);
  return () => s.off("job:done", handler);
}

export function onJobFailed(handler: (payload: { error: string }) => void): () => void {
  const s = getSocket();
  s.on("job:failed", handler);
  return () => s.off("job:failed", handler);
}

export function onJobStatus(handler: (payload: { status: string }) => void): () => void {
  const s = getSocket();
  s.on("job:status", handler);
  return () => s.off("job:status", handler);
}

export function resumeJob(jobId: string): void {
  getSocket().emit("job:resume", { jobId });
}

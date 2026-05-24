import type { Assignment } from "@veda/shared-types";

const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

async function req<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...init?.headers },
    ...init,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function createAssignment(
  formData: FormData,
): Promise<{ jobId: string; assignmentId: string }> {
  const res = await fetch(`${BASE}/api/assignments`, {
    method: "POST",
    body: formData,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<{ jobId: string; assignmentId: string }>;
}

export async function getAssignments(): Promise<Assignment[]> {
  return req<Assignment[]>(`/api/assignments`);
}

export async function getAssignment(id: string): Promise<Assignment> {
  return req<Assignment>(`/api/assignments/${id}`);
}

export async function deleteAssignment(id: string): Promise<void> {
  await req(`/api/assignments/${id}`, { method: "DELETE" });
}

export async function regenerateAssignment(id: string): Promise<{ jobId: string }> {
  return req(`/api/assignments/${id}/regenerate`, { method: "POST" });
}

export function getPdfUrl(id: string): string {
  return `${BASE}/api/assignments/${id}/pdf`;
}

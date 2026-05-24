"use client";

import { create } from "zustand";
import type { Assignment } from "@veda/shared-types";

type JobStatus = "idle" | "pending" | "processing" | "done" | "failed";

interface AppStore {
  assignments: Assignment[];
  currentJobId: string | null;
  currentAssignmentId: string | null;
  jobStatus: JobStatus;
  currentAssignment: Assignment | null;
  jobError: string | null;

  setAssignments: (list: Assignment[]) => void;
  addAssignment: (a: Assignment) => void;
  setCurrentJob: (jobId: string, assignmentId: string) => void;
  setJobStatus: (status: JobStatus, error?: string) => void;
  setCurrentAssignment: (a: Assignment) => void;
  reset: () => void;
}

export const useStore = create<AppStore>((set) => ({
  assignments: [],
  currentJobId: null,
  currentAssignmentId: null,
  jobStatus: "idle",
  currentAssignment: null,
  jobError: null,

  setAssignments: (list) => set({ assignments: list }),
  addAssignment: (a) => set((s) => ({ assignments: [a, ...s.assignments] })),
  setCurrentJob: (jobId, assignmentId) =>
    set({ currentJobId: jobId, currentAssignmentId: assignmentId, jobStatus: "pending" }),
  setJobStatus: (status, error) => set({ jobStatus: status, jobError: error ?? null }),
  setCurrentAssignment: (a) => set({ currentAssignment: a }),
  reset: () =>
    set({
      currentJobId: null,
      currentAssignmentId: null,
      jobStatus: "idle",
      currentAssignment: null,
      jobError: null,
    }),
}));

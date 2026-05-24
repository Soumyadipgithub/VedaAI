"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import type { Assignment } from "@veda/shared-types";
import { getAssignment, regenerateAssignment } from "@/lib/api";
import { joinJobRoom, onJobDone, onJobFailed, onJobStatus, resumeJob } from "@/lib/ws";
import { useStore } from "@/store";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileTopBar from "@/components/MobileTopBar";
import MobileBottomNav from "@/components/MobileBottomNav";
import AIGreetingCard from "@/components/AIGreetingCard";
import ExamPaper from "@/components/ExamPaper";
import { RefreshCw } from "lucide-react";

type PageStatus = "loading" | "processing" | "done" | "failed";

export default function OutputPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { currentJobId, setCurrentAssignment, setJobStatus } = useStore();

  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [pageStatus, setPageStatus] = useState<PageStatus>("loading");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [regenerating, setRegenerating] = useState(false);

  const handleDone = useCallback(
    (payload: { assignment: Assignment }) => {
      setAssignment(payload.assignment);
      setCurrentAssignment(payload.assignment);
      setJobStatus("done");
      setPageStatus("done");
    },
    [setCurrentAssignment, setJobStatus],
  );

  const handleFailed = useCallback(
    (payload: { error?: string }) => {
      setErrorMsg(payload.error ?? "Generation failed");
      setJobStatus("failed", payload.error);
      setPageStatus("failed");
    },
    [setJobStatus],
  );

  useEffect(() => {
    if (!id) return;

    // Fetch current state first
    getAssignment(id)
      .then((data) => {
        if (data.status === "done" && data.sections?.length) {
          setAssignment(data);
          setCurrentAssignment(data);
          setJobStatus("done");
          setPageStatus("done");
        } else if (data.status === "failed") {
          setErrorMsg(data.error ?? "Generation failed");
          setJobStatus("failed", data.error);
          setPageStatus("failed");
        } else {
          // pending or processing — join WS room and wait
          setPageStatus("processing");
          const jobId = currentJobId ?? id;
          joinJobRoom(jobId);
          resumeJob(id);
        }
      })
      .catch(() => {
        setPageStatus("failed");
        setErrorMsg("Assignment not found");
      });

    // Subscribe to WS events
    const offDone = onJobDone(handleDone);
    const offFailed = onJobFailed(handleFailed);
    const offStatus = onJobStatus((payload) => {
      if (payload.status === "processing") setPageStatus("processing");
    });

    return () => {
      offDone();
      offFailed();
      offStatus();
    };
  }, [id, currentJobId, handleDone, handleFailed, setCurrentAssignment, setJobStatus]);

  async function handleRegenerate() {
    if (!id || regenerating) return;
    setRegenerating(true);
    setPageStatus("processing");
    setAssignment(null);
    try {
      const { jobId } = await regenerateAssignment(id);
      joinJobRoom(jobId);
    } catch {
      setPageStatus("failed");
      setErrorMsg("Regeneration failed");
    } finally {
      setRegenerating(false);
    }
  }

  return (
    <div
      className="min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)" }}
    >
      <Sidebar active="home" variant="output" />
      <TopBar label="Create New" variant="opaque" onBack={() => router.push("/assignments")} />
      <MobileTopBar />

      {/* ── DESKTOP content — flow layout so root grows with content ── */}
      <div
        className="hidden lg:flex flex-col items-center"
        style={{
          marginLeft: 327,
          marginRight: 13,
          paddingTop: 80,
          paddingBottom: 40,
          gap: 16,
          minWidth: 0,
        }}
      >
        {/* Outer dark card */}
        <div
          className="flex flex-col items-center w-full"
          style={{
            background: "#5E5E5E",
            borderRadius: 32,
            padding: 20,
            gap: 12,
            minWidth: 0,
          }}
        >
          {pageStatus === "loading" || pageStatus === "processing" ? (
            <LoadingState />
          ) : pageStatus === "failed" ? (
            <FailedState message={errorMsg} onRegenerate={handleRegenerate} />
          ) : assignment ? (
            <>
              <AIGreetingCard assignmentId={id} />
              <ExamPaper assignment={assignment} />
            </>
          ) : null}
        </div>

        {/* Regenerate button below card */}
        {pageStatus === "done" && assignment && (
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="flex items-center font-brand"
            style={{
              height: 46,
              background: "#FFFFFF",
              borderRadius: 48,
              padding: "12px 24px",
              gap: 8,
              fontSize: 16,
              fontWeight: 500,
              color: "#303030",
              opacity: regenerating ? 0.7 : 1,
            }}
          >
            <RefreshCw size={20} color="#303030" />
            {regenerating ? "Regenerating…" : "Regenerate"}
          </button>
        )}
      </div>

      {/* ── MOBILE content ── */}
      <div className="lg:hidden" style={{ padding: "100px 10px 100px" }}>
        <div
          className="flex flex-col items-center"
          style={{
            background: "#FFFFFF",
            borderRadius: 40,
            padding: 9,
            gap: 10,
          }}
        >
          {pageStatus === "loading" || pageStatus === "processing" ? (
            <div className="flex flex-col items-center justify-center" style={{ minHeight: 300, gap: 16, padding: 32 }}>
              <div className="animate-spin" style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid #DADADA", borderTopColor: "#303030" }} />
              <p className="font-brand text-center" style={{ fontSize: 16, fontWeight: 500, color: "#5E5E5E" }}>
                {pageStatus === "loading" ? "Loading…" : "Generating your assignment…"}
              </p>
            </div>
          ) : pageStatus === "failed" ? (
            <div className="flex flex-col items-center" style={{ gap: 16, padding: 32 }}>
              <p className="font-brand text-center" style={{ fontSize: 16, fontWeight: 600, color: "#FF4040" }}>
                Generation failed
              </p>
              <p className="font-brand text-center" style={{ fontSize: 14, color: "#5E5E5E" }}>
                {errorMsg}
              </p>
              <button
                onClick={handleRegenerate}
                className="flex items-center font-brand"
                style={{ height: 44, background: "#181818", borderRadius: 48, padding: "12px 24px", gap: 8, fontSize: 16, fontWeight: 500, color: "#FFFFFF" }}
              >
                <RefreshCw size={20} color="#FFFFFF" />
                Try Again
              </button>
            </div>
          ) : assignment ? (
            <>
              <AIGreetingCard assignmentId={id} mobile />
              <ExamPaper assignment={assignment} mobile />
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className="flex items-center justify-center font-brand"
                style={{
                  height: 44,
                  background: "#303030",
                  borderRadius: 48,
                  padding: "12px 24px",
                  gap: 8,
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#FFFFFF",
                  width: "100%",
                  marginTop: 8,
                  opacity: regenerating ? 0.7 : 1,
                }}
              >
                <RefreshCw size={16} color="#FFFFFF" />
                {regenerating ? "Regenerating…" : "Regenerate"}
              </button>
            </>
          ) : null}
        </div>
      </div>

      <MobileBottomNav active="assignments" />
    </div>
  );
}

function LoadingState() {
  return (
    <div
      className="flex flex-col items-center justify-center"
      style={{ minHeight: 400, gap: 24 }}
    >
      <div
        className="animate-spin"
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          border: "4px solid rgba(255,255,255,0.2)",
          borderTopColor: "#FFFFFF",
        }}
      />
      <div className="flex flex-col items-center" style={{ gap: 8 }}>
        <p className="font-brand text-center" style={{ fontSize: 20, fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.8px" }}>
          Generating your assignment…
        </p>
        <p className="font-brand text-center" style={{ fontSize: 16, fontWeight: 400, color: "rgba(255,255,255,0.6)", letterSpacing: "-0.64px" }}>
          Our AI is crafting the perfect question paper for you.
        </p>
      </div>
    </div>
  );
}

function FailedState({ message, onRegenerate }: { message: string | null; onRegenerate: () => void }) {
  return (
    <div className="flex flex-col items-center" style={{ gap: 16, padding: 32 }}>
      <p className="font-brand text-center" style={{ fontSize: 20, fontWeight: 700, color: "#FF4040", letterSpacing: "-0.8px" }}>
        Generation failed
      </p>
      {message && (
        <p className="font-brand text-center" style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>
          {message}
        </p>
      )}
      <button
        onClick={onRegenerate}
        className="flex items-center font-brand"
        style={{ height: 46, background: "#FFFFFF", borderRadius: 48, padding: "12px 24px", gap: 8, fontSize: 16, fontWeight: 500, color: "#303030" }}
      >
        <RefreshCw size={20} color="#303030" />
        Try Again
      </button>
    </div>
  );
}

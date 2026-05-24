"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileTopBar from "@/components/MobileTopBar";
import UploadForm from "@/components/UploadForm";
import { createAssignment } from "@/lib/api";
import { useStore } from "@/store";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

const MOB_TABS = [
  { id: "home",        label: "Home",       iconSrc: "/icon/mob1.png",      href: "/" },
  { id: "assignments", label: "Assignments", iconSrc: "/icon/mob2.png",      href: "/assignments" },
  { id: "library",     label: "Library",    iconSrc: "/icon/excluicon.png",  href: "/" },
  { id: "toolkit",     label: "AI Toolkit", iconSrc: "/icon/aiicon.png",     href: "/" },
] as const;

export default function NewAssignmentPage() {
  const router = useRouter();
  const setCurrentJob = useStore((s) => s.setCurrentJob);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(fd: FormData) {
    setLoading(true);
    setError(null);
    try {
      const { jobId, assignmentId } = await createAssignment(fd);
      setCurrentJob(jobId, assignmentId);
      router.push(`/assignments/${assignmentId}/output`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)" }}
    >
      {/* Mobile background override — flat #CECECE under the form */}
      <div className="lg:hidden absolute inset-0 -z-10" style={{ background: "#CECECE" }} />

      <Sidebar active="assignments" variant="upload" />
      <TopBar label="Assignment" variant="frosted" onBack={() => router.back()} />
      <MobileTopBar />

      {/* Decorative glow ellipse (desktop only) */}
      <div
        className="hidden lg:block"
        style={{
          position: "absolute",
          bottom: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: 1113,
          height: 428,
          background: "rgba(76,76,76,0.4)",
          filter: "blur(200px)",
          borderRadius: "50%",
          pointerEvents: "none",
        }}
      />

      {/* ── DESKTOP content ── */}
      <div
        className="hidden lg:flex flex-col items-center"
        style={{ position: "absolute", top: 78, left: 327, right: 11, paddingBottom: 40 }}
      >
        <div className="relative flex flex-col items-center" style={{ gap: 32, width: "100%" }}>
          {/* Step indicator header */}
          <div className="flex items-center" style={{ width: "100%", padding: 8, gap: 16, height: 66 }}>
            <div className="flex items-center" style={{ gap: 12 }}>
              <div style={{ position: "relative", width: 20, height: 20, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ position: "absolute", width: 20, height: 20, borderRadius: "50%", border: "4px solid #4BC26D", opacity: 0.5 }} />
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#4BC26D", boxShadow: "0px 16px 24px rgba(0,0,0,0.12)" }} />
              </div>
              <div className="flex flex-col items-start" style={{ gap: 2 }}>
                <p className="font-brand" style={{ fontSize: 20, fontWeight: 700, color: "#303030", letterSpacing: "-0.8px", lineHeight: "28px" }}>
                  Create Assignment
                </p>
                <p className="font-brand" style={{ fontSize: 14, fontWeight: 400, color: "#5E5E5E", letterSpacing: "-0.56px", lineHeight: "19.6px" }}>
                  Set up a new assignment for your students
                </p>
              </div>
            </div>
          </div>

          {/* Step connectors */}
          <div className="flex w-full" style={{ maxWidth: 810, gap: 12, height: 0, marginTop: -16 }}>
            <div style={{ flex: 1, borderTop: "5px solid #5E5E5E" }} />
            <div style={{ flex: 1, borderTop: "5px solid #DADADA" }} />
          </div>

          {error && (
            <p className="font-brand text-center" style={{ color: "#FF4040", fontSize: 14 }}>{error}</p>
          )}
          <UploadForm
            formId="upload-form-desktop"
            onSubmit={handleSubmit}
            onBack={() => router.back()}
            loading={loading}
          />
        </div>
      </div>

      {/* ── MOBILE content ── */}
      {/* paddingBottom 180 = 158px bottom block + 22px extra breathing room */}
      <div className="lg:hidden flex flex-col" style={{ padding: "72px 10px 0", paddingBottom: 180 }}>
        {/* Header: back button + title */}
        <div className="flex items-center" style={{ gap: 24, marginBottom: 24 }}>
          <button
            className="flex items-center justify-center flex-shrink-0"
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              background: "rgba(255,255,255,0.25)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
              border: "none",
            }}
            onClick={() => router.back()}
          >
            <ArrowLeft size={24} color="#303030" strokeWidth={2.5} />
          </button>
          <p className="font-brand text-center flex-1" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px", lineHeight: "22.4px" }}>
            Create Assignment
          </p>
        </div>

        {/* Step connectors */}
        <div className="flex" style={{ gap: 12, marginBottom: 24 }}>
          <div style={{ flex: 1, height: 0, borderTop: "5px solid #5E5E5E", borderRadius: 100 }} />
          <div style={{ flex: 1, height: 0, borderTop: "5px solid #DADADA", borderRadius: 100 }} />
        </div>

        {error && (
          <p className="font-brand text-center" style={{ color: "#FF4040", fontSize: 14, marginBottom: 12 }}>{error}</p>
        )}

        <UploadForm
          formId="upload-form-mobile"
          onSubmit={handleSubmit}
          onBack={() => router.back()}
          loading={loading}
        />
      </div>

      {/* ── MOBILE bottom block: action row + nav bar in a fixed blurred strip ── */}
      <div
        className="lg:hidden fixed bottom-0 left-0 right-0 flex flex-col items-center"
        style={{
          background: "#FFFFFF",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          padding: "8px 10px",
          gap: 12,
          zIndex: 50,
        }}
      >
        {/* Action row */}
        <div className="flex items-center justify-center" style={{ gap: 13 }}>
          <button
            type="button"
            onClick={() => router.push("/assignments")}
            className="flex items-center justify-center font-brand"
            style={{ height: 46, background: "#FFFFFF", borderRadius: 48, padding: "12px 24px", gap: 4, fontSize: 16, fontWeight: 500, color: "#303030", border: "1px solid #DADADA" }}
          >
            <ArrowLeft size={20} color="#303030" />
            Previous
          </button>
          <button
            type="submit"
            form="upload-form-mobile"
            disabled={loading}
            className="flex items-center justify-center font-brand"
            style={{
              height: 46,
              background: "#181818",
              borderRadius: 48,
              padding: "12px 24px",
              gap: 4,
              fontSize: 16,
              fontWeight: 500,
              color: "#FFFFFF",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)",
            }}
          >
            {loading ? "Generating…" : "Next"}
            {!loading && <ArrowRight size={20} color="#FFFFFF" />}
          </button>
        </div>

        {/* Bottom nav */}
        <nav
          className="flex items-center justify-between"
          style={{
            width: "100%",
            maxWidth: 373,
            height: 72,
            background: "#181818",
            borderRadius: 24,
            padding: "8px 24px",
            boxShadow: "0px 16px 48px rgba(0,0,0,0.12), 0px 32px 48px rgba(0,0,0,0.2)",
          }}
        >
          {MOB_TABS.map(({ id, label, iconSrc, href }) => {
            const isActive = id === "assignments";
            return (
              <Link
                key={id}
                href={href}
                className="flex flex-col items-center justify-center"
                style={{ width: 52, height: 52, borderRadius: 26, paddingTop: 13, gap: 4, textDecoration: "none", flexShrink: 0 }}
              >
                <img src={iconSrc} alt={label} style={{ width: 20, height: 20, objectFit: "contain", display: "block", opacity: isActive ? 1 : 0.25 }} />
                <span className="font-brand" style={{ fontSize: 12, fontWeight: 600, color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.25)", letterSpacing: "-0.48px", lineHeight: "1.4" }}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Plus } from "lucide-react";
import type { Assignment } from "@veda/shared-types";
import { getAssignments, deleteAssignment } from "@/lib/api";
import { useStore } from "@/store";
import Sidebar from "@/components/Sidebar";
import TopBar from "@/components/TopBar";
import MobileTopBar from "@/components/MobileTopBar";
import MobileBottomNav from "@/components/MobileBottomNav";
import EmptyStateIllustration from "@/components/EmptyStateIllustration";
import AssignmentCard from "@/components/AssignmentCard";
import FilterSearchBar from "@/components/FilterSearchBar";

export default function AssignmentsPage() {
  const router = useRouter();
  const { setAssignments: setStoreAssignments } = useStore();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [filtered, setFiltered] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAssignments()
      .then((data) => {
        setAssignments(data);
        setFiltered(data);
        setStoreAssignments(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  function handleSearch(q: string) {
    const lower = q.toLowerCase();
    setFiltered(
      assignments.filter(
        (a) =>
          !q ||
          (a.input.title ?? "").toLowerCase().includes(lower) ||
          a.id.includes(lower),
      ),
    );
  }

  async function handleDelete(id: string) {
    await deleteAssignment(id).catch(console.error);
    setAssignments((prev) => prev.filter((a) => a.id !== id));
    setFiltered((prev) => prev.filter((a) => a.id !== id));
  }

  const isEmpty = !loading && filtered.length === 0 && assignments.length === 0;
  const hasData = !loading && assignments.length > 0;

  // Desktop layout columns (2 cols)
  const col1 = filtered.filter((_, i) => i % 2 === 0);
  const col2 = filtered.filter((_, i) => i % 2 === 1);

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-[#CECECE] lg:bg-transparent"
      style={{ background: "linear-gradient(180deg, #EEEEEE 0%, #DADADA 100%)" }}
    >
      <Sidebar active="assignments" variant="default" />
      <TopBar label="Assignment" variant="frosted" onBack={() => router.back()} />
      <MobileTopBar />

      {/* ── DESKTOP content — flow layout ── */}
      <div
        className="hidden lg:flex flex-col"
        style={{ marginLeft: 327, marginRight: 13, paddingTop: 90, paddingBottom: 40, gap: 12, position: "relative" }}
      >
        {loading && (
          <div className="flex items-center justify-center" style={{ height: 600 }}>
            <p className="font-brand" style={{ fontSize: 16, color: "#5E5E5E" }}>Loading…</p>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center" style={{ height: 600, gap: 32 }}>
            <div className="flex flex-col items-center" style={{ gap: 12 }}>
              <EmptyStateIllustration />
              <div className="flex flex-col items-center" style={{ gap: 2, width: 486 }}>
                <p
                  className="font-brand text-center"
                  style={{ fontSize: 20, fontWeight: 700, color: "#303030", letterSpacing: "-0.8px", lineHeight: "1.4" }}
                >
                  No assignments yet
                </p>
                <p
                  className="font-brand text-center"
                  style={{ fontSize: 16, fontWeight: 400, color: "rgba(94,94,94,0.8)", letterSpacing: "-0.64px", lineHeight: "1.4" }}
                >
                  Create your first assignment to start collecting and grading student submissions.
                  You can set up rubrics, define marking criteria, and let AI assist with grading.
                </p>
              </div>
            </div>
            <Link
              href="/assignments/new"
              className="flex items-center font-brand"
              style={{
                background: "#181818",
                border: "1.5px solid rgba(255,255,255,0.5)",
                borderRadius: 48,
                padding: "12px 24px",
                gap: 4,
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 500,
                letterSpacing: "-0.64px",
                lineHeight: "1.4",
                textDecoration: "none",
              }}
            >
              <Plus size={20} color="white" />
              Create Your First Assignment
            </Link>
          </div>
        )}

        {hasData && (
          <>
            {/* Section title row */}
            <div className="flex items-center" style={{ padding: "0 8px", gap: 12 }}>
              <div style={{ width: 12, height: 12, borderRadius: "50%", background: "linear-gradient(135deg, #FF5623, #E56820)" }} />
              <div className="flex flex-col" style={{ gap: 2 }}>
                <p className="font-brand" style={{ fontSize: 20, fontWeight: 700, color: "#303030", letterSpacing: "-0.8px", lineHeight: "1.4" }}>
                  Assignments
                </p>
                <p className="font-brand" style={{ fontSize: 14, fontWeight: 400, color: "rgba(94,94,94,0.55)", letterSpacing: "-0.56px", lineHeight: "1.4" }}>
                  Manage and create assignments for your classes.
                </p>
              </div>
            </div>

            {/* Filter + Search */}
            <FilterSearchBar onSearch={handleSearch} />

            {/* 2-column card grid — bottom padding clears the 73px fixed bar */}
            <div className="flex" style={{ gap: 16, alignItems: "flex-start", paddingBottom: 73 }}>
              <div className="flex flex-col" style={{ flex: 1, gap: 12 }}>
                {col1.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} onDelete={handleDelete} />
                ))}
              </div>
              <div className="flex flex-col" style={{ flex: 1, gap: 12 }}>
                {col2.map((a) => (
                  <AssignmentCard key={a.id} assignment={a} onDelete={handleDelete} />
                ))}
              </div>
            </div>
          </>
        )}
      </div>

      {/* Fixed bottom bar — desktop only: 73px fade gradient + centered pill button */}
      {hasData && (
        <div
          className="hidden lg:block"
          style={{
            position: "fixed",
            bottom: 0,
            left: 327,
            right: 13,
            height: 73,
            zIndex: 50,
            pointerEvents: "none",
          }}
        >
          {/* Blur layer — masked so blur only shows in the lower fade zone, not above button */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              maskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
              WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 60%)",
            }}
          />
          {/* Gradient fade on top of blur: transparent → #DADADA */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(180deg, rgba(234,234,234,0) 0%, #DADADA 100%)",
            }}
          />

          {/* Centered pill button */}
          <div
            className="flex items-center justify-center"
            style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
          >
            {/* Gradient border wrapper: white 50% top → transparent bottom */}
            <div
              style={{
                padding: 1.5,
                borderRadius: 9999,
                background: "linear-gradient(180deg, rgba(255,255,255,0.5) 0%, rgba(102,102,102,0) 100%)",
                pointerEvents: "auto",
              }}
            >
              <Link
                href="/assignments/new"
                className="flex items-center font-brand"
                style={{
                  background: "#181818",
                  borderRadius: 9999,
                  padding: "11px 28px",
                  gap: 8,
                  color: "#FFFFFF",
                  fontSize: 16,
                  fontWeight: 500,
                  letterSpacing: "-0.64px",
                  lineHeight: "1.4",
                  textDecoration: "none",
                }}
              >
                <Plus size={20} color="white" />
                Create Assignment
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* ── MOBILE content ── */}
      <div className="lg:hidden flex flex-col" style={{ minHeight: "100dvh", paddingTop: 92, paddingBottom: 100, paddingLeft: 10, paddingRight: 10, gap: 32 }}>
        {loading && (
          <div className="flex items-center justify-center" style={{ height: 300 }}>
            <p className="font-brand" style={{ fontSize: 16, color: "#5E5E5E" }}>Loading…</p>
          </div>
        )}

        {isEmpty && (
          <div className="flex flex-col items-center justify-center flex-1" style={{ gap: 32 }}>
            <div className="flex flex-col items-center" style={{ gap: 12 }}>
              <EmptyStateIllustration mobile />
              <div className="flex flex-col items-center" style={{ gap: 12, width: "100%" }}>
                <p className="font-brand text-center" style={{ fontSize: 20, fontWeight: 700, color: "#303030", letterSpacing: "-0.8px", lineHeight: "1.4" }}>
                  No assignments yet
                </p>
                <p className="font-brand text-center" style={{ fontSize: 16, fontWeight: 400, color: "rgba(94,94,94,0.8)", letterSpacing: "-0.64px", lineHeight: "1.4" }}>
                  Create your first assignment to start collecting and grading student submissions. You can set up rubrics, define marking criteria, and let AI assist with grading.
                </p>
              </div>
            </div>
            <Link
              href="/assignments/new"
              className="flex items-center font-brand"
              style={{
                background: "#181818",
                border: "1.5px solid rgba(255,255,255,0.5)",
                borderRadius: 48,
                padding: "12px 24px",
                gap: 4,
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: 500,
                textDecoration: "none",
              }}
            >
              <Plus size={20} color="white" />
              Create Your First Assignment
            </Link>
          </div>
        )}

        {hasData && (
          <div className="flex flex-col" style={{ gap: 20 }}>
            {/* Mobile header */}
            <div className="flex items-center justify-between" style={{ gap: 24 }}>
              <button
                className="flex items-center justify-center bg-white"
                style={{ width: 48, height: 48, borderRadius: 100 }}
                onClick={() => router.back()}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="#303030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <p className="font-brand text-center flex-1" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px", lineHeight: "22.4px" }}>
                Assignments
              </p>
            </div>

            <FilterSearchBar mobile onSearch={handleSearch} />

            <div className="flex flex-col" style={{ gap: 12 }}>
              {filtered.map((a) => (
                <AssignmentCard key={a.id} assignment={a} mobile onDelete={handleDelete} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Mobile centered create button — above bottom nav */}
      {!loading && hasData && (
        <div className="lg:hidden fixed flex justify-center" style={{ bottom: 90, left: 0, right: 0, zIndex: 60, pointerEvents: "none" }}>
          <Link
            href="/assignments/new"
            className="flex items-center font-brand"
            style={{
              background: "#181818",
              borderRadius: 48,
              padding: "12px 24px",
              gap: 8,
              color: "#FFFFFF",
              fontSize: 16,
              fontWeight: 500,
              textDecoration: "none",
              boxShadow: "0px 16px 24px rgba(0,0,0,0.2), 0px 32px 24px rgba(0,0,0,0.15)",
              pointerEvents: "auto",
            }}
          >
            <Plus size={20} color="white" />
            Create Assignment
          </Link>
        </div>
      )}

      <MobileBottomNav active="assignments" />
    </div>
  );
}

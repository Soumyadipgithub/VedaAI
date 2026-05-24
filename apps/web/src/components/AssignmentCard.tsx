"use client";

import { useState } from "react";
import { MoreVertical } from "lucide-react";
import Link from "next/link";
import type { Assignment } from "@veda/shared-types";

interface AssignmentCardProps {
  assignment: Assignment;
  mobile?: boolean;
  onDelete?: (id: string) => void;
}

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).replace(/\//g, "-");
  } catch {
    return dateStr;
  }
}

export default function AssignmentCard({ assignment, mobile = false, onDelete }: AssignmentCardProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  if (mobile) {
    return (
      <div
        className="relative bg-white flex flex-col"
        style={{
          width: "100%",
          maxWidth: 373,
          height: 116,
          padding: 20,
          borderRadius: 24,
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 24,
        }}
      >
        <div className="w-full flex flex-col" style={{ gap: 32 }}>
          <div className="flex items-center justify-between" style={{ width: "100%" }}>
            <span
              className="font-brand"
              style={{ fontSize: 18, fontWeight: 700, color: "#303030", letterSpacing: "-0.72px", lineHeight: "25.2px" }}
            >
              {assignment.input.title ?? `Assignment ${assignment.id.slice(-4)}`}
            </span>
            <button onClick={() => setDropdownOpen(!dropdownOpen)}>
              <MoreVertical size={24} color="#303030" />
            </button>
          </div>
          <div className="flex items-center" style={{ gap: 10 }}>
            <span className="font-brand" style={{ fontSize: 16, fontWeight: 400, color: "#000000", letterSpacing: "-0.64px" }}>
              Assigned on : {formatDate(assignment.createdAt)}
            </span>
            <span className="font-brand" style={{ fontSize: 16, fontWeight: 400, color: "#000000", letterSpacing: "-0.64px" }}>
              Due : {formatDate(assignment.input.dueDate)}
            </span>
          </div>
        </div>

        {dropdownOpen && (
          <div
            className="absolute z-10 bg-white flex flex-col"
            style={{
              right: 24,
              top: 48,
              padding: 8,
              borderRadius: 16,
              gap: 4,
              boxShadow: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)",
            }}
          >
            <Link
              href={`/assignments/${assignment.id}/output`}
              className="flex items-center px-2 font-brand"
              style={{ height: 32, borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px", textDecoration: "none", whiteSpace: "nowrap" }}
              onClick={() => setDropdownOpen(false)}
            >
              View Assignment
            </Link>
            <button
              className="flex items-center px-2 font-brand"
              style={{ height: 32, borderRadius: 8, background: "#F6F6F6", fontSize: 14, fontWeight: 500, color: "#C53535", letterSpacing: "-0.56px" }}
              onClick={() => { setDropdownOpen(false); onDelete?.(assignment.id); }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative" style={{ height: 162, width: "100%" }}>
      <div
        className="bg-white flex flex-col justify-between w-full h-full"
        style={{ padding: 24, borderRadius: 24 }}
      >
        {/* Top row */}
        <div className="flex items-start justify-between" style={{ width: "100%" }}>
          <div style={{ flex: 1, minWidth: 0, paddingRight: 12 }}>
            <span
              className="font-brand"
              style={{ fontSize: 24, fontWeight: 800, color: "#303030", letterSpacing: "-0.96px", lineHeight: "1.2" }}
            >
              {assignment.input.title ?? `Assignment ${assignment.id.slice(-4)}`}
            </span>
          </div>
          <button onClick={() => setDropdownOpen(!dropdownOpen)}>
            <MoreVertical size={24} color="#303030" />
          </button>
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          <span className="font-brand" style={{ fontSize: 16, color: "#303030", letterSpacing: "-0.64px", lineHeight: "1.2" }}>
            <strong style={{ fontWeight: 800 }}>Assigned on</strong>
            <span style={{ fontWeight: 400, color: "rgba(0,0,0,0.5)" }}> : {formatDate(assignment.createdAt)}</span>
          </span>
          <span className="font-brand" style={{ fontSize: 16, color: "#303030", letterSpacing: "-0.64px", lineHeight: "1.2" }}>
            <strong style={{ fontWeight: 800 }}>Due</strong>
            <span style={{ fontWeight: 400, color: "rgba(0,0,0,0.5)" }}> : {formatDate(assignment.input.dueDate)}</span>
          </span>
        </div>
      </div>

      {dropdownOpen && (
        <div
          className="absolute z-10 bg-white flex flex-col items-center"
          style={{
            right: 0,
            top: 54,
            padding: 8,
            borderRadius: 16,
            gap: 4,
            boxShadow: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)",
          }}
        >
          <Link
            href={`/assignments/${assignment.id}/output`}
            className="flex items-center px-2 w-full font-brand"
            style={{ height: 32, borderRadius: 8, fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px", textDecoration: "none", whiteSpace: "nowrap" }}
            onClick={() => setDropdownOpen(false)}
          >
            View Assignment
          </Link>
          <button
            className="flex items-center px-2 w-full font-brand"
            style={{ height: 32, borderRadius: 8, background: "#F6F6F6", fontSize: 14, fontWeight: 500, color: "#C53535", letterSpacing: "-0.56px" }}
            onClick={() => { setDropdownOpen(false); onDelete?.(assignment.id); }}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

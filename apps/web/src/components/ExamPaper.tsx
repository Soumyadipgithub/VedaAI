"use client";

import type { Assignment } from "@veda/shared-types";

interface ExamPaperProps {
  assignment: Assignment;
  mobile?: boolean;
}

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

export default function ExamPaper({ assignment, mobile = false }: ExamPaperProps) {
  const { input, sections } = assignment;
  const schoolName = input.schoolName || "";

  const diffTag = (d: string) =>
    `[${DIFFICULTY_LABEL[d] ?? d}]`;

  if (mobile) {
    return (
      <div
        className="flex flex-col w-full"
        style={{
          background: "#F6F6F6",
          borderRadius: 24,
          padding: "20px 16px",
          gap: 0,
        }}
      >
        {/* Header */}
        <div className="flex flex-col items-center" style={{ gap: 2, paddingBottom: 14, borderBottom: "1px solid #D4D4D4" }}>
          {schoolName && (
            <p className="font-paper text-center" style={{ fontSize: 15, fontWeight: 700, color: "#303030", lineHeight: "1.3" }}>
              {schoolName}
            </p>
          )}
          {input.subject && (
            <p className="font-paper text-center" style={{ fontSize: 13, fontWeight: 500, color: "#303030" }}>
              Subject: {input.subject}
            </p>
          )}
          {input.grade && (
            <p className="font-paper text-center" style={{ fontSize: 13, fontWeight: 500, color: "#303030" }}>
              Class: {input.grade}
            </p>
          )}
          <p className="font-paper text-center" style={{ fontSize: 15, fontWeight: 700, color: "#303030", marginTop: 4 }}>
            {input.title ?? "Assignment"}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-col" style={{ gap: 2, padding: "10px 0", borderBottom: "1px solid #E8E8E8" }}>
          {input.timeAllowed ? (
            <p className="font-paper" style={{ fontSize: 13, fontWeight: 600, color: "#303030" }}>
              Time Allowed: {input.timeAllowed} minutes
            </p>
          ) : (
            <p className="font-paper" style={{ fontSize: 13, fontWeight: 600, color: "#303030" }}>
              Due Date: {input.dueDate}
            </p>
          )}
          <p className="font-paper" style={{ fontSize: 13, fontWeight: 600, color: "#303030" }}>
            Maximum Marks: {input.totalMarks}
          </p>
          <p className="font-paper" style={{ fontSize: 13, fontWeight: 400, color: "#303030", marginTop: 4 }}>
            All questions are compulsory unless stated otherwise.
          </p>
        </div>

        {/* Student info */}
        <div className="flex flex-col" style={{ padding: "10px 0", gap: 2, borderBottom: "1px solid #E8E8E8" }}>
          {["Name", "Roll Number", "Class / Section"].map((field) => (
            <p key={field} className="font-paper" style={{ fontSize: 13, fontWeight: 400, color: "#303030", lineHeight: "1.8" }}>
              {field}: ______________________
            </p>
          ))}
        </div>

        {/* Sections */}
        {sections.map((section, si) => (
          <div key={si} className="flex flex-col" style={{ gap: 8, padding: "14px 0", borderBottom: si < sections.length - 1 ? "1px solid #E8E8E8" : "none" }}>
            <p className="font-paper text-center" style={{ fontSize: 14, fontWeight: 700, color: "#303030" }}>
              {section.title}
            </p>
            <p className="font-paper" style={{ fontSize: 12, fontWeight: 400, color: "#5E5E5E", fontStyle: "italic" }}>
              {section.instruction}
            </p>
            <div className="flex flex-col" style={{ gap: 8 }}>
              {section.questions.map((q, qi) => (
                <p key={qi} className="font-paper" style={{ fontSize: 13, fontWeight: 400, color: "#303030", lineHeight: "1.7" }}>
                  {qi + 1}.&nbsp;<span style={{ color: "#5E5E5E", fontSize: 11 }}>{diffTag(q.difficulty)} </span>{q.text}&nbsp;
                  <span style={{ color: "#5E5E5E", fontWeight: 600 }}>[{q.marks} Marks]</span>
                </p>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  }


  return (
    <div
      className="flex flex-col items-center w-full"
      style={{
        maxWidth: 1060,
        background: "#FFFFFF",
        borderRadius: 32,
        padding: "40px 48px",
        gap: 0,
      }}
    >
      <div className="flex flex-col w-full" style={{ maxWidth: 960, gap: 0 }}>

        {/* ── Header block ── */}
        <div className="flex flex-col items-center" style={{ gap: 3, paddingBottom: 20, borderBottom: "1.5px solid #D4D4D4" }}>
          {schoolName && (
            <p className="font-paper text-center" style={{ fontSize: 22, fontWeight: 700, color: "#303030", lineHeight: "1.3" }}>
              {schoolName}
            </p>
          )}
          {input.subject && (
            <p className="font-paper text-center" style={{ fontSize: 16, fontWeight: 500, color: "#303030", lineHeight: "1.4" }}>
              Subject: {input.subject}
            </p>
          )}
          {input.grade && (
            <p className="font-paper text-center" style={{ fontSize: 16, fontWeight: 500, color: "#303030", lineHeight: "1.4" }}>
              Class: {input.grade}
            </p>
          )}
          <p className="font-paper text-center" style={{ fontSize: 20, fontWeight: 700, color: "#303030", letterSpacing: "-0.4px", lineHeight: "1.4", marginTop: 6 }}>
            {input.title ?? "Assignment"}
          </p>
        </div>

        {/* ── Meta row: Time / Marks ── */}
        <div className="flex justify-between items-center" style={{ padding: "14px 0", borderBottom: "1px solid #E8E8E8" }}>
          {input.timeAllowed ? (
            <span className="font-paper" style={{ fontSize: 15, fontWeight: 600, color: "#303030" }}>
              Time Allowed: {input.timeAllowed} minutes
            </span>
          ) : (
            <span className="font-paper" style={{ fontSize: 15, fontWeight: 600, color: "#303030" }}>
              Due Date: {input.dueDate}
            </span>
          )}
          <span className="font-paper" style={{ fontSize: 15, fontWeight: 600, color: "#303030" }}>
            Maximum Marks: {input.totalMarks}
          </span>
        </div>

        {/* ── Instructions + Student info ── */}
        <div className="flex flex-col" style={{ gap: 4, padding: "16px 0", borderBottom: "1px solid #E8E8E8" }}>
          <p className="font-paper" style={{ fontSize: 15, fontWeight: 400, color: "#303030", lineHeight: "1.6" }}>
            All questions are compulsory unless stated otherwise.
          </p>
          <div className="flex flex-col" style={{ marginTop: 10, gap: 2 }}>
            {["Name", "Roll Number", "Class / Section"].map((field) => (
              <p key={field} className="font-paper" style={{ fontSize: 15, fontWeight: 400, color: "#303030", lineHeight: "1.8" }}>
                {field}: <span style={{ borderBottom: "1px solid #303030", display: "inline-block", minWidth: 180 }}>&nbsp;</span>
              </p>
            ))}
          </div>
        </div>

        {/* ── Sections ── */}
        {sections.map((section, si) => (
          <div key={si} className="flex flex-col" style={{ gap: 12, padding: "20px 0", borderBottom: si < sections.length - 1 ? "1px solid #E8E8E8" : "none" }}>
            <p className="font-paper text-center" style={{ fontSize: 17, fontWeight: 700, color: "#303030", letterSpacing: "-0.3px" }}>
              {section.title}
            </p>
            <p className="font-paper" style={{ fontSize: 14, fontWeight: 400, color: "#5E5E5E", fontStyle: "italic", lineHeight: "1.5" }}>
              {section.instruction}
            </p>
            <div className="flex flex-col" style={{ gap: 10 }}>
              {section.questions.map((q, qi) => (
                <p
                  key={qi}
                  className="font-paper"
                  style={{ fontSize: 15, fontWeight: 400, color: "#303030", lineHeight: "1.7", letterSpacing: "-0.2px" }}
                >
                  {qi + 1}.&nbsp;<span style={{ color: "#5E5E5E", fontSize: 13 }}>{diffTag(q.difficulty)} </span>{q.text}&nbsp;
                  <span style={{ color: "#5E5E5E", fontWeight: 600 }}>[{q.marks} Marks]</span>
                </p>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}

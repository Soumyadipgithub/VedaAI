import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToStream } from "@react-pdf/renderer";
import type { Readable } from "stream";

const COLOR_PRIMARY = "#303030";
const COLOR_MUTED = "#5E5E5E";
const COLOR_DIVIDER_STRONG = "#D4D4D4";
const COLOR_DIVIDER_SOFT = "#E8E8E8";

const DIFFICULTY_LABEL: Record<string, string> = {
  easy: "Easy",
  moderate: "Moderate",
  hard: "Hard",
};

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 48,
    paddingVertical: 44,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: COLOR_PRIMARY,
    lineHeight: 1.5,
  },
  headerBlock: { alignItems: "center", paddingBottom: 14 },
  schoolName: { fontSize: 18, fontFamily: "Helvetica-Bold", textAlign: "center" },
  schoolSub: { fontSize: 12, fontFamily: "Helvetica", textAlign: "center", marginTop: 2 },
  title: { fontSize: 16, fontFamily: "Helvetica-Bold", textAlign: "center", marginTop: 6 },
  dividerStrong: { borderBottomWidth: 1.5, borderBottomColor: COLOR_DIVIDER_STRONG, marginTop: 4 },
  dividerSoft: { borderBottomWidth: 1, borderBottomColor: COLOR_DIVIDER_SOFT },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
  },
  metaText: { fontSize: 12, fontFamily: "Helvetica-Bold" },
  studentBlock: { paddingVertical: 14 },
  instructionLine: { fontSize: 12, marginBottom: 10 },
  studentRow: { flexDirection: "row", alignItems: "flex-end", marginBottom: 6 },
  studentLabel: { fontSize: 12 },
  studentRule: {
    borderBottomWidth: 1,
    borderBottomColor: COLOR_PRIMARY,
    width: 240,
    marginLeft: 8,
    marginBottom: 2,
  },
  section: { paddingVertical: 14 },
  sectionTitle: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  sectionInstruction: {
    fontSize: 11,
    fontFamily: "Helvetica-Oblique",
    color: COLOR_MUTED,
    marginBottom: 10,
  },
  questionRow: { marginBottom: 8 },
  questionText: { fontSize: 12, lineHeight: 1.55 },
  diffTag: { fontSize: 10, color: COLOR_MUTED },
  marksTag: { fontSize: 11, fontFamily: "Helvetica-Bold", color: COLOR_MUTED },
});

interface Question {
  text: string;
  difficulty: string;
  marks: number;
}
interface Section {
  title: string;
  instruction: string;
  questions: Question[];
}
interface AssignmentData {
  input: {
    title?: string;
    schoolName?: string;
    subject?: string;
    grade?: string;
    timeAllowed?: number;
    dueDate?: string;
    totalMarks?: number;
  };
  sections: Section[];
}

const e = React.createElement;

function Header(input: AssignmentData["input"]) {
  const lines: React.ReactNode[] = [];
  if (input.schoolName) {
    lines.push(e(Text, { key: "school", style: styles.schoolName }, input.schoolName));
  }
  if (input.subject) {
    lines.push(e(Text, { key: "subject", style: styles.schoolSub }, `Subject: ${input.subject}`));
  }
  if (input.grade) {
    lines.push(e(Text, { key: "grade", style: styles.schoolSub }, `Class: ${input.grade}`));
  }
  lines.push(e(Text, { key: "title", style: styles.title }, input.title ?? "Assignment"));
  return e(View, { style: styles.headerBlock }, ...lines);
}

function MetaRow(input: AssignmentData["input"]) {
  const leftLabel = input.timeAllowed
    ? `Time Allowed: ${input.timeAllowed} minutes`
    : `Due Date: ${input.dueDate ?? "—"}`;
  return e(
    View,
    { style: styles.metaRow },
    e(Text, { style: styles.metaText }, leftLabel),
    e(Text, { style: styles.metaText }, `Maximum Marks: ${input.totalMarks ?? "—"}`),
  );
}

function StudentBlock() {
  const fields = ["Name", "Roll Number", "Class / Section"];
  return e(
    View,
    { style: styles.studentBlock },
    e(
      Text,
      { style: styles.instructionLine },
      "All questions are compulsory unless stated otherwise.",
    ),
    ...fields.map((field) =>
      e(
        View,
        { key: field, style: styles.studentRow },
        e(Text, { style: styles.studentLabel }, `${field}:`),
        e(View, { style: styles.studentRule }),
      ),
    ),
  );
}

function QuestionLine(q: Question, index: number) {
  const tag = `[${DIFFICULTY_LABEL[q.difficulty] ?? q.difficulty}]`;
  return e(
    View,
    { key: index, style: styles.questionRow },
    e(
      Text,
      { style: styles.questionText },
      `${index + 1}. `,
      e(Text, { style: styles.diffTag }, `${tag} `),
      q.text,
      "  ",
      e(Text, { style: styles.marksTag }, `[${q.marks} Marks]`),
    ),
  );
}

function SectionBlock(section: Section, index: number, isLast: boolean) {
  return e(
    View,
    {
      key: index,
      style: {
        ...styles.section,
        borderBottomWidth: isLast ? 0 : 1,
        borderBottomColor: COLOR_DIVIDER_SOFT,
      },
    },
    e(Text, { style: styles.sectionTitle }, section.title),
    e(Text, { style: styles.sectionInstruction }, section.instruction),
    ...section.questions.map((q, qi) => QuestionLine(q, qi)),
  );
}

export async function generatePDF(assignment: AssignmentData): Promise<Readable> {
  const { input, sections } = assignment;

  const doc = e(
    Document,
    null,
    e(
      Page,
      { size: "A4", style: styles.page },
      Header(input),
      e(View, { style: styles.dividerStrong }),
      MetaRow(input),
      e(View, { style: styles.dividerSoft }),
      StudentBlock(),
      e(View, { style: styles.dividerSoft }),
      ...sections.map((section, si) =>
        SectionBlock(section, si, si === sections.length - 1),
      ),
    ),
  );

  return renderToStream(doc) as unknown as Readable;
}

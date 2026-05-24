import React from "react";
import { Document, Page, Text, View, StyleSheet, renderToStream } from "@react-pdf/renderer";
import type { Readable } from "stream";

const styles = StyleSheet.create({
  page: {
    paddingHorizontal: 48,
    paddingVertical: 40,
    fontFamily: "Helvetica",
    fontSize: 11,
    color: "#303030",
    lineHeight: 1.6,
  },
  title: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginBottom: 6,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  metaText: { fontSize: 11, fontFamily: "Helvetica-Bold" },
  divider: { borderBottomWidth: 1, borderBottomColor: "#303030", marginVertical: 6 },
  sectionHeading: {
    fontSize: 13,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
    marginTop: 14,
    marginBottom: 4,
  },
  instruction: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 6 },
  studentLine: { fontSize: 11, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  questionText: {
    fontSize: 11,
    fontFamily: "Helvetica",
    lineHeight: 1.8,
    marginBottom: 4,
  },
  badge: {
    fontSize: 9,
    color: "#5E5E5E",
    marginRight: 4,
  },
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
    dueDate?: string;
    additionalInstructions?: string;
    numberOfQuestions?: number;
    totalMarks?: number;
  };
  sections: Section[];
}

export async function generatePDF(assignment: AssignmentData): Promise<Readable> {
  const { input, sections } = assignment;

  const doc = React.createElement(
    Document,
    null,
    React.createElement(
      Page,
      { size: "A4", style: styles.page },
      React.createElement(Text, { style: styles.title }, input.title ?? "Assignment"),
      React.createElement(View, { style: styles.divider }),
      React.createElement(
        View,
        { style: styles.metaRow },
        React.createElement(Text, { style: styles.metaText }, `Due: ${input.dueDate ?? "—"}`),
        React.createElement(
          Text,
          { style: styles.metaText },
          `Total Marks: ${input.totalMarks ?? "—"}`,
        ),
      ),
      React.createElement(View, { style: styles.divider }),
      React.createElement(Text, { style: styles.studentLine }, "Name: ___________________________"),
      React.createElement(Text, { style: styles.studentLine }, "Roll Number: ____________________"),
      React.createElement(Text, { style: styles.studentLine }, "Section: ________________________"),
      React.createElement(View, { style: { marginTop: 10 } }),
      ...sections.map((section, si) =>
        React.createElement(
          View,
          { key: si },
          React.createElement(Text, { style: styles.sectionHeading }, section.title),
          React.createElement(Text, { style: styles.instruction }, section.instruction),
          ...section.questions.map((q, qi) =>
            React.createElement(
              View,
              { key: qi, style: { flexDirection: "row", marginBottom: 6 } },
              React.createElement(
                Text,
                { style: styles.badge },
                `[${q.difficulty}]`,
              ),
              React.createElement(
                Text,
                { style: styles.questionText },
                `${qi + 1}. ${q.text}  [${q.marks} Marks]`,
              ),
            ),
          ),
        ),
      ),
    ),
  );

  return renderToStream(doc) as unknown as Readable;
}

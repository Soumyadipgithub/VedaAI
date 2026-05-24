"use client";

import { useState, useRef } from "react";
import {
  CloudUpload,
  ArrowRight,
  ArrowLeft,
  ChevronDown,
  X,
  Plus,
  Minus,
} from "lucide-react";
import type { QuestionType } from "@veda/shared-types";

const QT_LABELS: Record<QuestionType, string> = {
  multiple_choice: "Multiple Choice Questions",
  short_answer: "Short Questions",
  long_answer: "Long Questions",
  true_false: "True/False Questions",
  fill_blanks: "Fill in the Blanks",
};

const ALL_TYPES: QuestionType[] = [
  "multiple_choice",
  "short_answer",
  "long_answer",
  "true_false",
  "fill_blanks",
];

type QTEntry = { type: QuestionType; numberOfQuestions: number; marks: number };

const DEFAULT_ENTRIES: QTEntry[] = [
  { type: "multiple_choice", numberOfQuestions: 4, marks: 1 },
  { type: "short_answer", numberOfQuestions: 3, marks: 2 },
  { type: "long_answer", numberOfQuestions: 5, marks: 5 },
  { type: "fill_blanks", numberOfQuestions: 5, marks: 5 },
];

interface UploadFormProps {
  onSubmit: (formData: FormData) => void;
  onBack?: () => void;
  loading?: boolean;
  formId?: string;
}

export default function UploadForm({ onSubmit, onBack, loading = false, formId = "upload-form" }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [dragging, setDragging] = useState(false);
  const [title, setTitle] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [timeAllowed, setTimeAllowed] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [entries, setEntries] = useState<QTEntry[]>(DEFAULT_ENTRIES);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [openDropdown, setOpenDropdown] = useState<number | null>(null);
  const [listening, setListening] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const mobileDateRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  function toggleMic() {
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { alert("Speech recognition is not supported in this browser."); return; }

    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }

    const rec: SpeechRecognition = new SR();
    rec.lang = "en-US";
    rec.interimResults = false;
    rec.continuous = false;
    rec.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript;
      if (!transcript) return;
      setAdditionalInfo((prev) => prev ? prev + " " + transcript : transcript);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recognitionRef.current = rec;
    rec.start();
    setListening(true);
  }

  const totalQuestions = entries.reduce((s, e) => s + e.numberOfQuestions, 0);
  const totalMarks = entries.reduce((s, e) => s + e.numberOfQuestions * e.marks, 0);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) setFile(f);
  }

  function updateEntry(i: number, patch: Partial<QTEntry>) {
    setEntries((prev) => prev.map((e, idx) => (idx === i ? { ...e, ...patch } : e)));
  }

  function addEntry() {
    const used = new Set(entries.map((e) => e.type));
    const next = ALL_TYPES.find((t) => !used.has(t));
    if (next) setEntries((prev) => [...prev, { type: next, numberOfQuestions: 3, marks: 1 }]);
  }

  function removeEntry(i: number) {
    setEntries((prev) => prev.filter((_, idx) => idx !== i));
  }

  function validate(): boolean {
    const errs: Record<string, string> = {};
    if (!title.trim()) errs.title = "Assignment title is required";
    if (!dueDate) errs.dueDate = "Due date is required";
    if (entries.length === 0) errs.entries = "Add at least one question type";
    for (const e of entries) {
      if (e.numberOfQuestions < 1) errs.entries = "Questions must be at least 1";
      if (e.marks < 1) errs.entries = "Marks must be at least 1";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const fd = new FormData();
    if (file) fd.append("file", file);
    fd.append("title", title.trim());
    if (schoolName) fd.append("schoolName", schoolName);
    if (subject) fd.append("subject", subject);
    if (grade) fd.append("grade", grade);
    if (timeAllowed) fd.append("timeAllowed", timeAllowed);
    fd.append("dueDate", dueDate);
    fd.append("questionTypes", JSON.stringify(entries.map((e) => e.type)));
    fd.append("numberOfQuestions", String(totalQuestions));
    fd.append("totalMarks", String(totalMarks));
    if (additionalInfo) fd.append("additionalInstructions", additionalInfo);
    onSubmit(fd);
  }

  const dropzoneBase = {
    borderRadius: 24,
    border: `1.75px solid ${dragging ? "#FF5623" : "#000000"}`,
    padding: "24px 32px",
    gap: 16,
    cursor: "pointer",
  } as const;

  return (
    <form id={formId} onSubmit={handleSubmit}>
      <input
        ref={fileRef}
        type="file"
        accept="image/*,.pdf,.txt"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* ── DESKTOP (lg+) ── */}
      <div className="hidden lg:flex flex-col w-full items-center" style={{ gap: 32 }}>
        {/* Form panel */}
        <div
          className="bg-white flex flex-col w-full"
          style={{ maxWidth: 810, borderRadius: 32, padding: 32, gap: 32 }}
        >
          {/* Header */}
          <div className="flex flex-col" style={{ gap: 2 }}>
            <p
              className="font-brand"
              style={{ fontSize: 20, fontWeight: 700, color: "#303030", letterSpacing: "-0.8px", lineHeight: "28px" }}
            >
              Assignment Details
            </p>
            <p
              className="font-brand"
              style={{ fontSize: 14, fontWeight: 400, color: "#5E5E5E", letterSpacing: "-0.56px", lineHeight: "19.6px" }}
            >
              Basic information about your assignment
            </p>
          </div>

          {/* Body */}
          <div className="flex flex-col" style={{ gap: 16 }}>

            {/* A. Upload dropzone */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              <div
                className="flex flex-col items-center justify-center bg-white"
                style={{ height: 202, ...dropzoneBase }}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onClick={() => fileRef.current?.click()}
              >
                <div
                  className="flex items-center justify-center bg-white"
                  style={{ width: 40, height: 40, borderRadius: 8 }}
                >
                  <CloudUpload size={24} color="#1E1E1E" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col" style={{ gap: 4 }}>
                  <p className="font-brand text-center" style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "22.4px" }}>
                    {file ? file.name : "Choose a file or drag & drop it here"}
                  </p>
                  <p className="font-brand text-center" style={{ fontSize: 14, fontWeight: 400, color: "#A9A9A9", letterSpacing: "-0.56px", lineHeight: "19.6px" }}>
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "JPEG, PNG, PDF, upto 10MB"}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center font-brand"
                  style={{ height: 36, background: "#F6F6F6", borderRadius: 48, padding: "8px 24px", gap: 4, fontSize: 14, fontWeight: 500, color: "#303030" }}
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                >
                  Browse Files <ArrowRight size={16} />
                </button>
              </div>
              <p className="font-brand text-center" style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "22.4px" }}>
                Upload images of your preferred document/image
              </p>
            </div>

            {/* B. Paper Details — 2×2 grid */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              {/* Row 0: Title (required, full width) */}
              <div className="flex flex-col" style={{ gap: 6 }}>
                <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                  Assignment Title <span style={{ color: "#FF5623" }}>*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Science Test"
                  className="font-brand outline-none bg-white"
                  style={{ height: 44, border: `1.25px solid ${errors.title ? "#FF4040" : "#DADADA"}`, borderRadius: 100, padding: "11px 16px", fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px" }}
                />
                {errors.title && <p className="font-brand" style={{ fontSize: 13, color: "#FF4040", paddingLeft: 8 }}>{errors.title}</p>}
              </div>

              {/* Row 1: School Name + Subject */}
              <div className="flex" style={{ gap: 12 }}>
                <div className="flex flex-col flex-1" style={{ gap: 6 }}>
                  <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                    School Name <span style={{ fontWeight: 400, color: "#5E5E5E" }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                    placeholder="e.g. Delhi Public School, Bokaro"
                    className="font-brand outline-none bg-white"
                    style={{ height: 44, border: "1.25px solid #DADADA", borderRadius: 100, padding: "11px 16px", fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px" }}
                  />
                </div>
                <div className="flex flex-col flex-1" style={{ gap: 6 }}>
                  <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                    Subject <span style={{ fontWeight: 400, color: "#5E5E5E" }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. English"
                    className="font-brand outline-none bg-white"
                    style={{ height: 44, border: "1.25px solid #DADADA", borderRadius: 100, padding: "11px 16px", fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px" }}
                  />
                </div>
              </div>

              {/* Row 2: Class/Grade + Time Allowed */}
              <div className="flex" style={{ gap: 12 }}>
                <div className="flex flex-col flex-1" style={{ gap: 6 }}>
                  <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                    Class / Grade <span style={{ fontWeight: 400, color: "#5E5E5E" }}>(optional)</span>
                  </label>
                  <input
                    type="text"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    placeholder="e.g. 5th"
                    className="font-brand outline-none bg-white"
                    style={{ height: 44, border: "1.25px solid #DADADA", borderRadius: 100, padding: "11px 16px", fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px" }}
                  />
                </div>
                <div className="flex flex-col flex-1" style={{ gap: 6 }}>
                  <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                    Time Allowed <span style={{ fontWeight: 400, color: "#5E5E5E" }}>(minutes, optional)</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={600}
                    value={timeAllowed}
                    onChange={(e) => setTimeAllowed(e.target.value)}
                    placeholder="e.g. 45"
                    className="font-brand outline-none bg-white"
                    style={{ height: 44, border: "1.25px solid #DADADA", borderRadius: 100, padding: "11px 16px", fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px" }}
                  />
                </div>
              </div>
            </div>

            {/* C. Due Date */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px", lineHeight: "22.4px" }}>
                Due Date
              </label>
              <div
                className="flex items-center justify-between"
                style={{ height: 44, border: "1.25px solid #DADADA", borderRadius: 100, padding: "11px 16px" }}
              >
                <input
                  type="date"
                  ref={dateRef}
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="font-brand flex-1 outline-none bg-transparent"
                  style={{ fontSize: 16, fontWeight: 500, color: dueDate ? "#303030" : "#A9A9A9", letterSpacing: "-0.64px" }}
                />
                <button type="button" onClick={() => dateRef.current?.showPicker?.()}>
                  <img src="/icon/dateicon.png" alt="" style={{ width: 24, height: 24, objectFit: "contain", display: "block" }} />
                </button>
              </div>
              {errors.dueDate && (
                <p className="font-brand text-sm" style={{ color: "#FF4040" }}>{errors.dueDate}</p>
              )}
            </div>

            {/* D. Question Type + Steppers */}
            <div className="flex flex-col" style={{ gap: 16 }}>
              {/* Column headings row */}
              <div className="flex items-start justify-between" style={{ gap: 64 }}>
                <div style={{ width: 471 }}>
                  <p className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                    Question Type
                  </p>
                </div>
                <div className="flex justify-end" style={{ width: 275, gap: 16 }}>
                  <p className="font-brand text-center" style={{ width: 116, fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px" }}>
                    No. of Questions
                  </p>
                  <p className="font-brand text-center" style={{ width: 100, fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px" }}>
                    Marks
                  </p>
                </div>
              </div>

              {/* Entry rows */}
              {entries.map((entry, i) => (
                <div key={i} className="flex items-center justify-between" style={{ gap: 64 }}>
                  {/* Selector pill + X */}
                  <div className="flex items-center" style={{ width: 471, gap: 12 }}>
                    <div className="relative" style={{ flex: 1 }}>
                      <button
                        type="button"
                        className="flex items-center justify-between bg-white font-brand focus:outline-none"
                        style={{ width: 443, height: 44, borderRadius: 100, padding: "11px 16px", fontSize: 16, fontWeight: 500, color: "#303030", border: "none", outline: "none" }}
                        onClick={() => setOpenDropdown(openDropdown === i ? null : i)}
                      >
                        <span style={{ letterSpacing: "-0.64px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 380 }}>
                          {QT_LABELS[entry.type]}
                        </span>
                        <ChevronDown size={16} color="#303030" />
                      </button>
                      {openDropdown === i && (
                        <div
                          className="absolute z-20 bg-white flex flex-col"
                          style={{ top: 48, left: 0, minWidth: 280, borderRadius: 16, padding: 8, boxShadow: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)", gap: 4 }}
                        >
                          {ALL_TYPES.map((t) => (
                            <button
                              key={t}
                              type="button"
                              className="font-brand text-left px-3 py-2"
                              style={{
                                borderRadius: 8,
                                fontSize: 14,
                                fontWeight: 500,
                                color: t === entry.type ? "#FF5623" : "#303030",
                                background: t === entry.type ? "#F6F6F6" : "transparent",
                                whiteSpace: "nowrap",
                              }}
                              onClick={() => { updateEntry(i, { type: t }); setOpenDropdown(null); }}
                            >
                              {QT_LABELS[t]}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <button type="button" onClick={() => removeEntry(i)}>
                      <X size={16} color="#5E5E5E" />
                    </button>
                  </div>

                  {/* Steppers */}
                  <div className="flex justify-end" style={{ width: 275, gap: 16 }}>
                    <div
                      className="flex items-center justify-between bg-white"
                      style={{ width: 100, height: 44, borderRadius: 100, padding: "11px 8px" }}
                    >
                      <button type="button" onClick={() => updateEntry(i, { numberOfQuestions: Math.max(1, entry.numberOfQuestions - 1) })}>
                        <Minus size={16} color="#DADADA" />
                      </button>
                      <span className="font-brand" style={{ fontSize: 16, fontWeight: 500, color: "#303030" }}>
                        {entry.numberOfQuestions}
                      </span>
                      <button type="button" onClick={() => updateEntry(i, { numberOfQuestions: Math.min(50, entry.numberOfQuestions + 1) })}>
                        <Plus size={16} color="#DADADA" strokeWidth={1.5} />
                      </button>
                    </div>
                    <div
                      className="flex items-center justify-between bg-white"
                      style={{ width: 100, height: 44, borderRadius: 100, padding: "11px 8px" }}
                    >
                      <button type="button" onClick={() => updateEntry(i, { marks: Math.max(1, entry.marks - 1) })}>
                        <Minus size={16} color="#DADADA" />
                      </button>
                      <span className="font-brand" style={{ fontSize: 16, fontWeight: 500, color: "#303030" }}>
                        {entry.marks}
                      </span>
                      <button type="button" onClick={() => updateEntry(i, { marks: Math.min(100, entry.marks + 1) })}>
                        <Plus size={16} color="#DADADA" strokeWidth={1.5} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Add + Totals */}
              <div className="flex items-center justify-between">
                {entries.length < ALL_TYPES.length ? (
                  <button type="button" className="flex items-center" style={{ gap: 8 }} onClick={addEntry}>
                    <div className="flex items-center justify-center" style={{ width: 36, height: 36, background: "#2B2B2B", borderRadius: 48 }}>
                      <Plus size={20} color="white" />
                    </div>
                    <span className="font-brand" style={{ fontSize: 14, fontWeight: 700, color: "#303030", letterSpacing: "-0.56px", lineHeight: "19.6px" }}>
                      Add Question Type
                    </span>
                  </button>
                ) : (
                  <div />
                )}
                <div className="flex flex-col" style={{ gap: 8, textAlign: "right" }}>
                  <p className="font-brand" style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "17.6px" }}>
                    Total Questions :&nbsp;&nbsp;{totalQuestions}
                  </p>
                  <p className="font-brand" style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "17.6px" }}>
                    Total Marks :&nbsp;&nbsp;{totalMarks}
                  </p>
                </div>
              </div>
              {errors.entries && (
                <p className="font-brand text-sm" style={{ color: "#FF4040" }}>{errors.entries}</p>
              )}
            </div>

            {/* D. Additional Information */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                Additional Information{" "}
                <span style={{ fontWeight: 400, color: "#5E5E5E" }}>(For better output)</span>
              </label>
              <div
                className="flex flex-col justify-between items-end bg-white"
                style={{ height: 102, borderRadius: 16, border: "1.25px solid #DADADA", padding: 16, gap: 10 }}
              >
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  className="font-brand w-full flex-1 outline-none resize-none bg-transparent"
                  style={{ fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px", lineHeight: "19.6px" }}
                  maxLength={2000}
                />
                <button
                  type="button"
                  onClick={toggleMic}
                  className="flex items-center justify-center flex-shrink-0"
                  style={{
                    width: 36,
                    height: 36,
                    background: listening ? "#FF5623" : "#F0F0F0",
                    borderRadius: 18,
                    transition: "background 0.2s",
                  }}
                >
                  <img src="/icon/Union.png" alt="" style={{ width: 16, height: 16, objectFit: "contain", display: "block", filter: listening ? "brightness(10)" : "none" }} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Action row */}
        <div className="flex items-center justify-between w-full" style={{ maxWidth: 810 }}>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center font-brand"
            style={{ height: 46, background: "#FFFFFF", borderRadius: 48, padding: "12px 24px", gap: 4, fontSize: 16, fontWeight: 500, color: "#303030" }}
          >
            <ArrowLeft size={20} color="#303030" />
            Previous
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center font-brand"
            style={{ height: 46, background: "#181818", borderRadius: 48, padding: "12px 24px", gap: 4, fontSize: 16, fontWeight: 500, color: "#FFFFFF", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Generating…" : "Next"}
            {!loading && <ArrowRight size={20} color="#FFFFFF" />}
          </button>
        </div>
      </div>

      {/* ── MOBILE (< lg) ── */}
      <div className="lg:hidden flex flex-col" style={{ gap: 24 }}>
        <div className="bg-white flex flex-col" style={{ borderRadius: 32, padding: "32px 16px", gap: 24 }}>
          {/* Header */}
          <div className="flex flex-col" style={{ gap: 2 }}>
            <p className="font-brand" style={{ fontSize: 20, fontWeight: 700, color: "#303030", letterSpacing: "-0.8px", lineHeight: "28px" }}>
              Assignment Details
            </p>
            <p className="font-brand" style={{ fontSize: 14, fontWeight: 400, color: "#5E5E5E", letterSpacing: "-0.56px", lineHeight: "19.6px" }}>
              Basic information about your assignment
            </p>
          </div>

          <div className="flex flex-col" style={{ gap: 16 }}>
            {/* A. Upload dropzone */}
            <div className="flex flex-col" style={{ gap: 12 }}>
              <div
                className="flex flex-col items-center justify-center"
                style={{ height: 202, background: "#F6F6F6", ...dropzoneBase }}
                onClick={() => fileRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
              >
                <div className="flex items-center justify-center bg-white" style={{ width: 40, height: 40, borderRadius: 8 }}>
                  <CloudUpload size={24} color="#1E1E1E" strokeWidth={2.5} />
                </div>
                <div className="flex flex-col" style={{ gap: 4 }}>
                  <p className="font-brand text-center" style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "22.4px" }}>
                    {file ? file.name : "Choose a file or drag & drop it here"}
                  </p>
                  <p className="font-brand text-center" style={{ fontSize: 14, fontWeight: 400, color: "#A9A9A9", letterSpacing: "-0.56px", lineHeight: "19.6px" }}>
                    {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "JPEG, PNG, PDF, upto 10MB"}
                  </p>
                </div>
                <button
                  type="button"
                  className="flex items-center font-brand bg-white"
                  style={{ height: 36, borderRadius: 48, padding: "8px 24px", gap: 4, fontSize: 14, fontWeight: 500, color: "#303030" }}
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                >
                  Browse Files <ArrowRight size={16} />
                </button>
              </div>
              <p className="font-brand text-center" style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "22.4px" }}>
                Upload images of your preferred document/image
              </p>
            </div>

            {/* B. Paper Details */}
            <div className="flex flex-col" style={{ gap: 10 }}>
              {/* Title — required */}
              <div className="flex flex-col" style={{ gap: 6 }}>
                <label className="font-brand" style={{ fontSize: 14, fontWeight: 700, color: "#303030", letterSpacing: "-0.56px" }}>
                  Assignment Title <span style={{ color: "#FF5623" }}>*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Mid-Term Science Test"
                  className="font-brand outline-none bg-white"
                  style={{ height: 44, border: `1.25px solid ${errors.title ? "#FF4040" : "#DADADA"}`, borderRadius: 100, padding: "11px 16px", fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px" }}
                />
                {errors.title && <p className="font-brand" style={{ fontSize: 12, color: "#FF4040", paddingLeft: 8 }}>{errors.title}</p>}
              </div>
              {[
                { label: "School Name", placeholder: "e.g. Delhi Public School, Bokaro", value: schoolName, set: setSchoolName, type: "text" },
                { label: "Subject", placeholder: "e.g. English", value: subject, set: setSubject, type: "text" },
                { label: "Class / Grade", placeholder: "e.g. 5th", value: grade, set: setGrade, type: "text" },
                { label: "Time Allowed (minutes)", placeholder: "e.g. 45", value: timeAllowed, set: setTimeAllowed, type: "number" },
              ].map(({ label, placeholder, value, set, type }) => (
                <div key={label} className="flex flex-col" style={{ gap: 6 }}>
                  <label className="font-brand" style={{ fontSize: 14, fontWeight: 700, color: "#303030", letterSpacing: "-0.56px" }}>
                    {label} <span style={{ fontWeight: 400, color: "#5E5E5E" }}>(optional)</span>
                  </label>
                  <input
                    type={type}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder={placeholder}
                    className="font-brand outline-none bg-white"
                    style={{ height: 44, border: "1.25px solid #DADADA", borderRadius: 100, padding: "11px 16px", fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px" }}
                  />
                </div>
              ))}
            </div>

            {/* C. Due Date */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>Due Date</label>
              <div className="flex items-center justify-between" style={{ height: 44, border: `1.25px solid ${errors.dueDate ? "#FF4040" : "#DADADA"}`, borderRadius: 100, padding: "11px 16px" }}>
                <input
                  ref={mobileDateRef}
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="font-brand flex-1 outline-none bg-transparent"
                  style={{ fontSize: 16, fontWeight: 500, color: dueDate ? "#303030" : "#A9A9A9", letterSpacing: "-0.64px" }}
                />
                <button
                  type="button"
                  onClick={() => { mobileDateRef.current?.showPicker?.(); mobileDateRef.current?.click(); }}
                  className="flex-shrink-0 outline-none"
                  style={{ background: "none", border: "none", padding: 0, cursor: "pointer" }}
                >
                  <img src="/icon/dateicon.png" alt="" style={{ width: 24, height: 24, objectFit: "contain", display: "block" }} />
                </button>
              </div>
              {errors.dueDate && (
                <p className="font-brand text-sm" style={{ color: "#FF4040" }}>{errors.dueDate}</p>
              )}
            </div>

            {/* D. Question Type — mobile cards */}
            <div className="flex flex-col" style={{ gap: 16 }}>
              <p className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                Question Type
              </p>
              {entries.map((entry, i) => (
                <div key={i} className="flex flex-col bg-white" style={{ borderRadius: 24, padding: 12, gap: 12 }}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center" style={{ gap: 8 }}>
                      <span className="font-brand" style={{ fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px" }}>
                        {QT_LABELS[entry.type]}
                      </span>
                      <ChevronDown size={16} color="#303030" />
                    </div>
                    <button type="button" onClick={() => removeEntry(i)}>
                      <X size={16} color="#5E5E5E" />
                    </button>
                  </div>
                  <div className="flex" style={{ background: "#F0F0F0", borderRadius: 24, padding: 8, gap: 12 }}>
                    <div className="flex flex-col items-center flex-1" style={{ gap: 8 }}>
                      <span className="font-brand text-center" style={{ fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px" }}>
                        No. of Questions
                      </span>
                      <div className="flex items-center justify-between bg-white" style={{ width: "100%", height: 38, borderRadius: 100, padding: "8px 12px" }}>
                        <button type="button" onClick={() => updateEntry(i, { numberOfQuestions: Math.max(1, entry.numberOfQuestions - 1) })}>
                          <Minus size={16} color="#5E5E5E" />
                        </button>
                        <span className="font-brand" style={{ fontSize: 16, fontWeight: 500, color: "#303030" }}>{entry.numberOfQuestions}</span>
                        <button type="button" onClick={() => updateEntry(i, { numberOfQuestions: Math.min(50, entry.numberOfQuestions + 1) })}>
                          <Plus size={16} color="#5E5E5E" />
                        </button>
                      </div>
                    </div>
                    <div className="flex flex-col items-center flex-1" style={{ gap: 8 }}>
                      <span className="font-brand text-center" style={{ fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px" }}>
                        Marks
                      </span>
                      <div className="flex items-center justify-between bg-white" style={{ width: "100%", height: 38, borderRadius: 100, padding: "8px 12px" }}>
                        <button type="button" onClick={() => updateEntry(i, { marks: Math.max(1, entry.marks - 1) })}>
                          <Minus size={16} color="#5E5E5E" />
                        </button>
                        <span className="font-brand" style={{ fontSize: 16, fontWeight: 500, color: "#303030" }}>{entry.marks}</span>
                        <button type="button" onClick={() => updateEntry(i, { marks: Math.min(100, entry.marks + 1) })}>
                          <Plus size={16} color="#5E5E5E" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {entries.length < ALL_TYPES.length && (
                <button type="button" className="flex items-center" style={{ gap: 8 }} onClick={addEntry}>
                  <div className="flex items-center justify-center" style={{ width: 36, height: 36, background: "#2B2B2B", borderRadius: 48 }}>
                    <Plus size={20} color="white" />
                  </div>
                  <span className="font-brand" style={{ fontSize: 14, fontWeight: 700, color: "#303030", letterSpacing: "-0.56px" }}>
                    Add Question Type
                  </span>
                </button>
              )}
              <div className="flex flex-col" style={{ gap: 8, alignItems: "flex-end" }}>
                <p className="font-brand" style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "17.6px" }}>
                  Total Questions :&nbsp;&nbsp;{totalQuestions}
                </p>
                <p className="font-brand" style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "17.6px" }}>
                  Total Marks :&nbsp;&nbsp;{totalMarks}
                </p>
              </div>
              {errors.entries && (
                <p className="font-brand text-sm" style={{ color: "#FF4040" }}>{errors.entries}</p>
              )}
            </div>

            {/* D. Additional Information */}
            <div className="flex flex-col" style={{ gap: 8 }}>
              <label className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px" }}>
                Additional Information{" "}
                <span style={{ fontWeight: 400, color: "#5E5E5E" }}>(For better output)</span>
              </label>
              <div
                className="flex flex-col justify-between items-end"
                style={{ height: 102, borderRadius: 16, border: "1.25px solid #DADADA", padding: 16, gap: 10 }}
              >
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="e.g Generate a question paper for 3 hour exam duration..."
                  className="font-brand w-full flex-1 outline-none resize-none bg-transparent"
                  style={{ fontSize: 14, fontWeight: 500, color: "#303030", letterSpacing: "-0.56px", lineHeight: "19.6px" }}
                  maxLength={2000}
                />
                <button type="button" className="flex items-center justify-center" style={{ width: 36, height: 36, background: "#F0F0F0", borderRadius: 18 }}>
                  <img src="/icon/Union.png" alt="" style={{ width: 16, height: 16, objectFit: "contain", display: "block" }} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </form>
  );
}

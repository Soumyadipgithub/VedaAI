"use client";

import { Download } from "lucide-react";
import Link from "next/link";

interface AIGreetingCardProps {
  assignmentId: string;
  message?: string;
  mobile?: boolean;
}

export default function AIGreetingCard({
  assignmentId,
  message = "Certainly! Here is your customized Question Paper as requested.",
  mobile = false,
}: AIGreetingCardProps) {
  if (mobile) {
    return (
      <div
        className="w-full flex flex-col"
        style={{
          background: "#303030",
          borderRadius: 32,
          padding: "24px 16px",
          gap: 12,
          justifyContent: "center",
          alignItems: "flex-start",
          boxShadow: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)",
        }}
      >
        <p
          className="font-brand"
          style={{
            fontSize: 14,
            fontWeight: 700,
            color: "#F0F0F0",
            letterSpacing: "-0.56px",
            lineHeight: "16.8px",
          }}
        >
          {message}
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/assignments/${assignmentId}/pdf`}
          download
          className="flex items-center justify-center"
          style={{
            width: 36,
            height: 36,
            borderRadius: 100,
            background: "#F6F6F6",
          }}
        >
          <Download size={20} color="#303030" />
        </a>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center items-center w-full"
      style={{
        maxWidth: 1060,
        background: "#181818",
        borderRadius: 32,
        padding: "24px 32px",
        gap: 24,
      }}
    >
      <div className="flex flex-col items-center w-full" style={{ maxWidth: 996, gap: 16 }}>
        <p
          className="font-brand text-center"
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: "#FFFFFF",
            letterSpacing: "-0.80px",
            lineHeight: "28px",
          }}
        >
          {message}
        </p>
        <a
          href={`${process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000"}/api/assignments/${assignmentId}/pdf`}
          download
          className="flex items-center justify-center"
          style={{
            width: 200,
            height: 44,
            background: "#FFFFFF",
            borderRadius: 100,
            gap: 4,
            padding: "0 24px",
            textDecoration: "none",
          }}
        >
          <Download size={24} color="#303030" />
          <span
            className="font-brand"
            style={{ fontSize: 16, fontWeight: 500, color: "#303030", letterSpacing: "-0.64px", lineHeight: "22px" }}
          >
            Download as PDF
          </span>
        </a>
      </div>
    </div>
  );
}

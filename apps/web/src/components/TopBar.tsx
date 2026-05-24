"use client";

import { Bell, ChevronDown, ArrowLeft } from "lucide-react";

interface TopBarProps {
  label?: string;
  variant?: "frosted" | "opaque";
  onBack?: () => void;
}

export default function TopBar({ label = "Assignment", variant = "frosted", onBack }: TopBarProps) {
  const bg = variant === "frosted" ? "rgba(255,255,255,0.75)" : "#FFFFFF";

  return (
    <div
      className="fixed hidden lg:flex items-center overflow-hidden z-30"
      style={{
        top: 12,
        left: 327,
        right: 13,
        height: 56,
        background: bg,
        backdropFilter: variant === "frosted" ? "blur(8px)" : "none",
        borderRadius: 16,
        padding: "0 12px 0 24px",
        gap: 10,
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="flex items-center justify-center flex-shrink-0"
        style={{ width: 40, height: 40, borderRadius: 100, background: "#FFFFFF" }}
      >
        <ArrowLeft size={24} color="#303030" />
      </button>

      {/* Breadcrumb */}
      <div className="flex items-center flex-1" style={{ gap: 8 }}>
        <img
          src="/icon/Icon.png"
          alt=""
          style={{ width: 20, height: 20, objectFit: "contain", display: "block", flexShrink: 0 }}
        />
        <span
          className="font-brand"
          style={{
            fontSize: 16,
            fontWeight: 600,
            color: "#A9A9A9",
            letterSpacing: "-0.64px",
          }}
        >
          {label}
        </span>
      </div>

      {/* Notification */}
      <div className="relative flex-shrink-0">
        <div
          className="flex items-center justify-center"
          style={{ width: 36, height: 36, borderRadius: 100, background: "#F6F6F6" }}
        >
          <Bell size={24} color="#303030" />
        </div>
        <div
          className="absolute"
          style={{
            top: 1,
            left: 27,
            width: 8,
            height: 8,
            borderRadius: "50%",
            background: "#FF4040",
          }}
        />
      </div>

      {/* Profile pill */}
      <div
        className="flex items-center flex-shrink-0"
        style={{
          padding: "6px 12px",
          borderRadius: 12,
          gap: 8,
          background: "#FFFFFF",
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            overflow: "hidden",
            flexShrink: 0,
            background: "#F6F6F6",
          }}
        >
          <img
            src="/profile.png"
            alt="John Doe"
            style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
          />
        </div>
        <span
          className="font-brand"
          style={{ fontSize: 16, fontWeight: 600, color: "#303030", letterSpacing: "-0.64px" }}
        >
          John Doe
        </span>
        <ChevronDown size={24} color="#303030" />
      </div>
    </div>
  );
}

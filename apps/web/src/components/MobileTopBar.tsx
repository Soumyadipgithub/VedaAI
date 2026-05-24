"use client";

import { Bell, Menu } from "lucide-react";
import LogoTile from "./LogoTile";

export default function MobileTopBar() {
  return (
    <div
      className="lg:hidden fixed top-0 left-0 right-0 z-50"
      style={{ padding: "18px 20px", background: "rgba(255,255,255,0.01)" }}
    >
      <div
        className="flex items-center justify-between bg-white"
        style={{
          borderRadius: 16,
          height: 56,
          padding: "0 16px 0 12px",
        }}
      >
        {/* Left */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <LogoTile variant="orange" size={28} />
          <span
            className="font-brand"
            style={{ fontSize: 20, fontWeight: 700, color: "#303030", letterSpacing: "-1.2px", lineHeight: "1.4" }}
          >
            VedaAI
          </span>
        </div>
        {/* Right */}
        <div className="flex items-center" style={{ gap: 12 }}>
          <div className="relative">
            <div
              className="flex items-center justify-center"
              style={{ width: 36, height: 36, borderRadius: 100, background: "#F6F6F6" }}
            >
              <Bell size={24} color="#303030" />
            </div>
            <div
              className="absolute"
              style={{ top: 1, left: 27, width: 8, height: 8, borderRadius: "50%", background: "#FF4040" }}
            />
          </div>
          <div style={{ width: 32, height: 32, borderRadius: "50%", overflow: "hidden", flexShrink: 0, background: "#F6F6F6" }}>
            <img
              src="/profile.png"
              alt="John Doe"
              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
            />
          </div>
          <Menu size={24} color="#303030" />
        </div>
      </div>
    </div>
  );
}

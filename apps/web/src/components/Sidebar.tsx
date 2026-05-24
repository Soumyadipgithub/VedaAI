"use client";

import Link from "next/link";
import LogoTile from "./LogoTile";
import { useStore } from "@/store";

type ActiveItem = "home" | "groups" | "assignments" | "toolkit" | "library" | "settings" | "review" | "analytics";
type Variant = "default" | "output" | "upload";

interface SidebarProps {
  active?: ActiveItem;
  variant?: Variant;
}

interface MenuItem {
  id: ActiveItem;
  label: string;
  iconSrc: string;
  iconActiveSrc?: string;
  href: string;
  badge?: string;
}

const menuItems: MenuItem[] = [
  { id: "home",        label: "Home",                iconSrc: "/icon/deepicon.png",   href: "/" },
  { id: "groups",      label: "My Groups",           iconSrc: "/icon/class.png",      href: "/" },
  { id: "assignments", label: "Assignments",         iconSrc: "/icon/assign.png",     href: "/assignments" },
  { id: "toolkit",     label: "AI Teacher's Toolkit",iconSrc: "/icon/Book.png",       href: "/" },
  { id: "library",     label: "My Library",          iconSrc: "/icon/task.png",       href: "/" },
];

const bottomItems: MenuItem[] = [
  { id: "settings", label: "Settings", iconSrc: "/icon/seetingicon.png", href: "/" },
];

function NavIcon({ iconSrc, iconActiveSrc, isActive }: { iconSrc: string; iconActiveSrc?: string; isActive: boolean }) {
  const src = isActive && iconActiveSrc ? iconActiveSrc : iconSrc;
  return (
    <img
      src={src}
      alt=""
      style={{
        width: 20,
        height: 20,
        objectFit: "contain",
        display: "block",
        flexShrink: 0,
        opacity: 1,
      }}
    />
  );
}

export default function Sidebar({ active = "assignments", variant = "default" }: SidebarProps) {
  const assignmentCount = useStore((s) => s.assignments.length);
  const logoVariant = variant === "output" ? "dark" : "orange";
  const pillLabel = variant === "output" ? "AI Teacher's Toolkit" : "Create Assignment";

  return (
    <aside
      className="fixed hidden lg:flex flex-col justify-between bg-white z-40"
      style={{
        top: 12,
        left: 12,
        width: 304,
        height: "calc(100vh - 24px)",
        overflowY: "auto",
        borderRadius: 16,
        padding: 24,
        boxShadow: "0px 16px 24px rgba(0,0,0,0.12), 0px 32px 24px rgba(0,0,0,0.2)",
      }}
    >
      {/* Top group */}
      <div className="flex flex-col" style={{ gap: 56 }}>
        {/* Brand row */}
        <div className="flex items-center" style={{ gap: 8 }}>
          <LogoTile variant={logoVariant} size={40} />
          <span
            className="font-brand"
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#303030",
              letterSpacing: "-1.68px",
              lineHeight: "20px",
            }}
          >
            VedaAI
          </span>
        </div>

        <div className="flex flex-col" style={{ gap: 8 }}>
          {/* Create Assignment / AI Toolkit pill */}
          <Link
            href="/assignments/new"
            className="flex items-center justify-center"
            style={{
              height: 42,
              borderRadius: 100,
              border: "4px solid #FF7950",
              background: "#272727",
              boxShadow:
                "inset 0 -1px 3.5px rgba(177,177,177,0.6), inset 0 0 34.5px rgba(255,255,255,0.25)",
              gap: 10,
              padding: "8px 43px",
            }}
          >
            <img src="/icon/aiicon.png" alt="" style={{ width: 18, height: 18, objectFit: "contain", display: "block" }} />
            <span
              className="font-paper"
              style={{
                fontSize: 16,
                fontWeight: 500,
                color: "#FFFFFF",
                letterSpacing: "-0.64px",
                lineHeight: "28px",
                whiteSpace: "nowrap",
              }}
            >
              {pillLabel}
            </span>
          </Link>

          {/* Menu list */}
          <nav className="flex flex-col" style={{ gap: 8, width: 251 }}>
            {menuItems.map(({ id, label, iconSrc, iconActiveSrc, href }) => {
              const isActive = active === id;
              const badge = id === "assignments" && assignmentCount > 0 ? String(assignmentCount) : undefined;
              return (
                <Link
                  key={id}
                  href={href}
                  className="flex items-center"
                  style={{
                    width: 254,
                    padding: id === "home" ? "9px 12px" : "8px 12px",
                    gap: 8,
                    height: 40,
                    borderRadius: 8,
                    background: isActive ? "#F0F0F0" : "transparent",
                    textDecoration: "none",
                  }}
                >
                  <NavIcon iconSrc={iconSrc} iconActiveSrc={iconActiveSrc} isActive={isActive} />
                  <span
                    className="font-brand"
                    style={{
                      fontSize: 16,
                      fontWeight: isActive ? 500 : 400,
                      color: isActive ? "#303030" : "rgba(94,94,94,0.8)",
                      letterSpacing: "-0.64px",
                      lineHeight: "1.4",
                      flex: 1,
                    }}
                  >
                    {label}
                  </span>
                  {badge && (
                    <span
                      className="font-brand"
                      style={{
                        background: "#FF5623",
                        borderRadius: variant === "upload" ? 8 : 48,
                        padding: "0 10px",
                        fontSize: 14,
                        fontWeight: 600,
                        color: "#FFFFFF",
                        letterSpacing: "-0.56px",
                        lineHeight: "20px",
                        boxShadow: "0 0 32.3px rgba(255,161,10,0.25)",
                      }}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}

          </nav>
        </div>
      </div>

      {/* Bottom group */}
      <div className="flex flex-col" style={{ gap: 8 }}>
        {bottomItems.map(({ id, label, iconSrc, href }) => {
          const isActive = active === id;
          return (
            <Link
              key={id}
              href={href}
              className="flex items-center"
              style={{
                width: 254,
                padding: "8px 12px",
                gap: 8,
                height: 40,
                borderRadius: 8,
                background: isActive ? "#F0F0F0" : "transparent",
                textDecoration: "none",
              }}
            >
              <NavIcon iconSrc={iconSrc} isActive={isActive} />
              <span className="font-brand" style={{ fontSize: 16, fontWeight: isActive ? 500 : 400, color: isActive ? "#303030" : "rgba(94,94,94,0.8)", letterSpacing: "-0.64px" }}>
                {label}
              </span>
            </Link>
          );
        })}

        {/* Profile card */}
        <div
          className="flex items-center"
          style={{
            background: "#F0F0F0",
            borderRadius: 16,
            padding: 12,
            gap: 8,
            width: "100%",
          }}
        >
          <div
            className="flex-shrink-0"
            style={{
              width: 52,
              height: 52,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <img
              src="/DSPlogo.png"
              alt="Delhi Public School"
              style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
            />
          </div>
          <div className="flex flex-col" style={{ gap: 2 }}>
            <span className="font-brand" style={{ fontSize: 16, fontWeight: 700, color: "#303030", letterSpacing: "-0.64px", lineHeight: "1.4" }}>
              Delhi Public School
            </span>
            <span className="font-brand" style={{ fontSize: 14, fontWeight: 400, color: "#5E5E5E", letterSpacing: "-0.56px", lineHeight: "1.4" }}>
              Bokaro Steel City
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}

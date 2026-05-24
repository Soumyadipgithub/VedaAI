"use client";

import Link from "next/link";

type ActiveTab = "home" | "assignments" | "library" | "toolkit";

interface MobileBottomNavProps {
  active?: ActiveTab;
}

const tabs = [
  { id: "home"        as ActiveTab, label: "Home",        iconSrc: "/icon/mob1.png",     href: "/" },
  { id: "assignments" as ActiveTab, label: "Assignments",  iconSrc: "/icon/mob2.png",     href: "/assignments" },
  { id: "library"     as ActiveTab, label: "Library",      iconSrc: "/icon/excluicon.png", href: "/" },
  { id: "toolkit"     as ActiveTab, label: "AI Toolkit",   iconSrc: "/icon/aiicon.png",   href: "/" },
];

export default function MobileBottomNav({ active = "assignments" }: MobileBottomNavProps) {
  return (
    <div className="lg:hidden fixed bottom-[11px] left-0 right-0 z-50 flex justify-center px-[10px]">
      <nav
        className="flex items-center justify-between"
        style={{
          width: "100%",
          maxWidth: 373,
          height: 72,
          background: "#181818",
          borderRadius: 24,
          padding: "8px 24px",
          boxShadow: "0px 16px 48px rgba(0,0,0,0.12), 0px 32px 48px rgba(0,0,0,0.2)",
        }}
      >
        {tabs.map(({ id, label, iconSrc, href }) => {
          const isActive = active === id;
          return (
            <Link
              key={id}
              href={href}
              className="flex flex-col items-center justify-center"
              style={{
                width: 52,
                height: 52,
                borderRadius: 26,
                paddingTop: 13,
                gap: 4,
                textDecoration: "none",
                flexShrink: 0,
              }}
            >
              <img
                src={iconSrc}
                alt={label}
                style={{
                  width: 20,
                  height: 20,
                  objectFit: "contain",
                  display: "block",
                  opacity: isActive ? 1 : 0.25,
                }}
              />
              <span
                className="font-brand"
                style={{
                  fontSize: 12,
                  fontWeight: 600,
                  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.25)",
                  letterSpacing: "-0.48px",
                  lineHeight: "1.4",
                }}
              >
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

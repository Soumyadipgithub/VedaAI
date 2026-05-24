"use client";

interface LogoTileProps {
  variant?: "orange" | "dark";
  size?: number;
}

export default function LogoTile({ size = 40 }: LogoTileProps) {
  return (
    <img
      src="/mainlogo.png"
      alt="VedaAI"
      style={{
        display: "block",
        width: size,
        height: size,
        objectFit: "cover",
        objectPosition: "center top",
        flexShrink: 0,
      }}
    />
  );
}

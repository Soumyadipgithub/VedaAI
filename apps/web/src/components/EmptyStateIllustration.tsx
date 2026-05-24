"use client";

export default function EmptyStateIllustration({ mobile = false }: { mobile?: boolean }) {
  const size = mobile ? 220 : 300;
  return (
    <img
      src="/icon/Illustrations.png"
      alt=""
      style={{ width: size, height: size, objectFit: "contain", display: "block" }}
    />
  );
}

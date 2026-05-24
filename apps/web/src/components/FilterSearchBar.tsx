"use client";

import { useState } from "react";
import { Filter, Search } from "lucide-react";

interface FilterSearchBarProps {
  mobile?: boolean;
  onSearch?: (query: string) => void;
}

export default function FilterSearchBar({ mobile = false, onSearch }: FilterSearchBarProps) {
  const [query, setQuery] = useState("");

  function handleChange(val: string) {
    setQuery(val);
    onSearch?.(val);
  }

  if (mobile) {
    return (
      <div
        className="flex items-center justify-between bg-white"
        style={{ height: 64, borderRadius: 16, padding: "0 16px", width: "100%" }}
      >
        <div className="flex items-center" style={{ gap: 4 }}>
          <Filter size={20} color="#A9A9A9" />
          <span
            className="font-brand"
            style={{ fontSize: 14, fontWeight: 400, color: "#A9A9A9", letterSpacing: "-0.56px", lineHeight: "19.6px" }}
          >
            Filter
          </span>
        </div>
        <div
          className="flex items-center"
          style={{
            flex: 1,
            minWidth: 0,
            maxWidth: 228,
            marginLeft: 16,
            height: 44,
            border: "1px solid #000000",
            borderRadius: 100,
            padding: "11px 16px",
            gap: 12,
          }}
        >
          <Search size={20} color="#A9A9A9" />
          <input
            className="font-brand flex-1 bg-transparent outline-none"
            style={{ fontSize: 14, fontWeight: 400, color: "#303030", letterSpacing: "-0.56px" }}
            placeholder="Search Name"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-between bg-white overflow-hidden"
      style={{ height: 64, borderRadius: 20, padding: "0 16px", width: "100%" }}
    >
      <div className="flex items-center" style={{ gap: 4 }}>
        <Filter size={20} color="#A9A9A9" />
        <span
          className="font-brand"
          style={{ fontSize: 14, fontWeight: 700, color: "#A9A9A9", letterSpacing: "-0.56px", lineHeight: "1.4" }}
        >
          Filter By
        </span>
      </div>
      <div
        className="flex items-center"
        style={{
          width: 380,
          height: 44,
          border: "1px solid rgba(0,0,0,0.2)",
          borderRadius: 100,
          padding: "11px 16px",
          gap: 12,
        }}
      >
        <Search size={20} color="#A9A9A9" />
        <input
          className="font-brand flex-1 bg-transparent outline-none"
          style={{ fontSize: 14, fontWeight: 700, color: "#A9A9A9", letterSpacing: "-0.56px" }}
          placeholder="Search Assignment"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
    </div>
  );
}

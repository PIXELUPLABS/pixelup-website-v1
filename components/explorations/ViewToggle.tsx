"use client";

import { useState } from "react";

const views = [
  { key: "grid", label: "Grid" },
  { key: "zoom", label: "Zoom" },
] as const;

/** Grid/Zoom toggle above the exploration images — clicked button turns
    blue, the other turns white. */
export function ViewToggle() {
  const [view, setView] = useState<"grid" | "zoom">("zoom");

  return (
    <div className="flex gap-2 pb-2">
      {views.map((item) => (
        <button
          key={item.key}
          type="button"
          aria-pressed={view === item.key}
          onClick={() => setView(item.key)}
          className={`flex h-6 cursor-pointer items-center justify-center px-2 text-[12px] font-medium uppercase leading-none transition-colors ${
            view === item.key ? "bg-[#0658FC] text-white" : "bg-white text-black"
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
}

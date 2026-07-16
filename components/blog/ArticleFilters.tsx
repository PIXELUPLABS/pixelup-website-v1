"use client";

import { useState } from "react";

const categories = ["All", "Branding", "Design", "Development"];
const displayModes = ["List", "Grid"];

function Pill({
  label,
  active,
  onClick,
  width,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  /** Fixed width in px — only the Display pills use this; Filter pills stay auto-sized. */
  width?: number;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      style={width ? { width } : undefined}
      className={`flex h-6 cursor-pointer items-center justify-center rounded-[12px] px-2 text-[12px] font-medium uppercase leading-none transition-colors ${
        active
          ? "border-transparent bg-accent text-white"
          : "border-transparent bg-white text-black hover:bg-white/80"
      }`}
    >
      {label}
    </button>
  );
}

/** "Filter" (category pills) + "Display" (list/grid pills), side by side. */
export function ArticleFilters() {
  const [category, setCategory] = useState(categories[0]);
  const [display, setDisplay] = useState(displayModes[0]);

  return (
    <div className="flex flex-col gap-6 desk:flex-row desk:items-start desk:gap-0">
      {/* 1068/1400 ≈ 76.29% of the row, matching the requested fixed split. */}
      <div className="flex flex-col gap-[10px] desk:w-[76.29%]">
        <p className="text-[12px] font-medium uppercase text-label-grey">Filters:</p>
        <div className="flex flex-wrap gap-2">
          {categories.map((item) => (
            <Pill
              key={item}
              label={item}
              active={category === item}
              onClick={() => setCategory(item)}
            />
          ))}
        </div>
      </div>
      {/* Hidden on mobile — only the Filter pills show there. */}
      <div className="hidden gap-[10px] desk:flex desk:w-[23.71%] desk:flex-col">
        <p className="text-[12px] font-medium uppercase text-label-grey">Display:</p>
        <div className="flex gap-2">
          {displayModes.map((item) => (
            <Pill
              key={item}
              label={item}
              active={display === item}
              onClick={() => setDisplay(item)}
              width={58}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

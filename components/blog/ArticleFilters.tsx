"use client";

import { useState } from "react";

const categories = ["All", "Branding", "Design", "Development"];
const displayModes = ["List", "Grid"];

/** Sharp-edged filter pill: transparent + hairline border, filled with the
    site's subtle grey button overlay when active. */
function Pill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`cursor-pointer rounded-none px-3 py-1 font-button text-[12px] font-semibold uppercase tracking-[-0.02em] transition-colors ${
        active
          ? "border border-transparent bg-button-dark text-white"
          : "border border-dashed border-hairline bg-transparent hover:bg-button-dark text-white/40"
      }`}
    >
      {label}
    </button>
  );
}

export function ArticleFilters() {
  const [category, setCategory] = useState(categories[0]);
  const [display, setDisplay] = useState(displayModes[0]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-[10px]">
        <p className="text-[12px] font-medium uppercase text-label-grey">Filters:</p>
        <div className="flex flex-wrap gap-2">
          {categories.flatMap((item) => [
            // basis-full forces a flex-wrap break — Development always
            // starts a new line instead of only wrapping when the aside
            // gets narrow.
            ...(item === "Development" ? [<div key={`${item}-break`} className="basis-full" />] : []),
            <Pill
              key={item}
              label={item}
              active={category === item}
              onClick={() => setCategory(item)}
            />,
          ])}
        </div>
      </div>
      <div className="flex flex-col gap-[10px]">
        <p className="text-[12px] font-medium uppercase text-label-grey">Display:</p>
        <div className="flex flex-wrap gap-2">
          {displayModes.map((item) => (
            <Pill
              key={item}
              label={item}
              active={display === item}
              onClick={() => setDisplay(item)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

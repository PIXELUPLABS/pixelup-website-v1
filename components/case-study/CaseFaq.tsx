"use client";

import { useState } from "react";
import type { FaqItem } from "@/lib/case-studies";

function PlusMinusIcon({ open }: { open: boolean }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={`shrink-0 text-white transition-transform duration-300 ease-out ${
        open ? "rotate-180" : ""
      }`}
    >
      <path d="M5 12h14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      {/* Vertical bar folds away as the item opens: + morphs into −. */}
      <path
        d="M12 5v14"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        className={`origin-center transition-all duration-300 ease-out ${
          open ? "rotate-90 opacity-0" : ""
        }`}
      />
    </svg>
  );
}

/** FAQ accordion — one item open at a time, first item open by default (as in Figma). */
export function CaseFaq({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flex flex-col divide-y-[0.5px] divide-hairline">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.q} className="py-3 first:pt-0 last:pb-0">
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setOpenIndex(open ? null : index)}
              className="group flex w-full cursor-pointer items-center justify-between gap-2 text-left"
            >
              <span className="text-[16px] leading-[1.5] text-white transition-opacity duration-200 group-hover:opacity-60">
                {item.q}
              </span>
              <span className="transition-opacity duration-200 group-hover:opacity-60">
                <PlusMinusIcon open={open} />
              </span>
            </button>
            {/* Answer stays in the DOM; grid-rows animates the height. */}
            <div
              className={`grid transition-[grid-template-rows] duration-300 ease-out ${
                open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p
                  className={`pt-3 text-[16px] leading-[1.5] text-white/60 transition-opacity duration-300 ${
                    open ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

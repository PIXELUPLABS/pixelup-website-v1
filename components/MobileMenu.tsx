"use client";

import Link from "next/link";
import { useState } from "react";
import { links } from "@/lib/projects";

// Hamburger shown only on mobile (< desk). Toggles a small links panel.
export function MobileMenu() {
  const [open, setOpen] = useState(false);

  return (
    <div className="desk:hidden">
      <button
        type="button"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="fade-up flex h-9 w-9 items-center justify-center text-white"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          {open ? (
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          ) : (
            <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          )}
        </svg>
      </button>

      {open && (
        <div className="absolute inset-x-5 top-16 z-20 flex flex-col gap-2 rounded-[4px] border border-white/10 bg-black/95 p-3">
          <a
            href={links.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-[2px] px-3 py-2.5 text-[14px] text-white hover:bg-white/5"
          >
            Chat on Telegram
          </a>
          <Link
            href={links.bookCall}
            onClick={() => setOpen(false)}
            className="rounded-[2px] bg-accent px-3 py-2.5 text-[14px] font-medium text-white"
          >
            Start now
          </Link>
        </div>
      )}
    </div>
  );
}

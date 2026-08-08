"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { navLinks } from "./Navbar";

// Hamburger shown only on mobile (< desk). Toggles a small links panel.
export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

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
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
          className="fixed inset-x-0 top-16 bottom-0 z-10 bg-scrim"
        />
      )}

      {open && (
        <div className="absolute inset-x-0 top-16 z-20 flex flex-col gap-2 border-t border-white/10 bg-black p-4">
          {navLinks.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`rounded-[2px] px-3 py-2.5 text-[14px] font-medium uppercase tracking-[-0.02em] ${
                  pathname === item.href ? "text-white" : "text-white/70 hover:bg-white/5"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="cursor-default rounded-[2px] px-3 py-2.5 text-[14px] font-medium uppercase tracking-[-0.02em] text-white/30"
              >
                {item.label}
              </span>
            )
          )}
        </div>
      )}
    </div>
  );
}

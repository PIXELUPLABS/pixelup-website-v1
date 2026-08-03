"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ctaButtonBase } from "./CtaButtons";
import { navLinks } from "./Navbar";
import { TallyPopupLink } from "./TallyPopupLink";
import { links } from "@/lib/projects";

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
          <div aria-hidden="true" className="border-t border-white/10" />
          {/* Same CTA pair as the desktop Navbar (perception audit + book a
              call), not the sidebars' CtaButtons — the dropdown replaces the
              Navbar's hidden desk:flex nav, so it mirrors that. Closing the
              panel on tap so the Tally modal isn't stacked over an open menu. */}
          <div className="flex flex-col gap-2.5">
            <TallyPopupLink
              onClick={() => setOpen(false)}
              className={`${ctaButtonBase} text-white uppercase bg-button-dark hover:bg-white/[0.12]`}
            >
              <span>GET A PERCEPTION AUDIT</span>
              <Image src="/media/Container.svg" alt="" width={14} height={14} aria-hidden="true" />
            </TallyPopupLink>
            <a
              href={links.discoveryCall}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className={`${ctaButtonBase} text-white uppercase bg-accent hover:brightness-110`}
            >
              <span>BOOK A CALL</span>
              <Image src="/media/Container.svg" alt="" width={14} height={14} aria-hidden="true" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

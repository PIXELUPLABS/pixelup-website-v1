"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

const navLinks: { label: string; href: string | null }[] = [
  // { label: "About", href: null },
  // { label: "YC Partner", href: null },
  { label: "Explorations", href: "/" },
  // { label: "Services", href: null },
  { label: "Blog", href: "/blog" },
];

/**
 * Full-width sticky top bar, separate from LeftNav's own logo/header.
 * Fixed at h-16 — LeftNav's sticky offset (see its `sticky` prop) is
 * computed against this exact height, so changing it here means updating
 * that offset too. Transparent at the top of the page, picks up the
 * base/90 + blur backing once the page has scrolled.
 */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 0);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 h-16 border-b-[0.5px] border-hairline transition-colors ${
        scrolled ? "bg-base/90 backdrop-blur" : "bg-transparent"
      }`}
    >
      <div className="flex h-full items-center justify-between gap-6 px-5">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-8 desk:flex">
          {navLinks.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                className="font-button text-[13px] font-semibold uppercase tracking-[-0.02em] text-white/70 transition-colors hover:text-white"
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="cursor-default font-button text-[13px] font-semibold uppercase tracking-[-0.02em] text-white/30"
              >
                {item.label}
              </span>
            )
          )}
        </nav>
        <MobileMenu />
      </div>
    </header>
  );
}


"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

export const navLinks: { label: string; href: string | null }[] = [
  // { label: "About", href: null },
  // { label: "YC Partner", href: null },
  { label: "Explorations", href: "/explorations" },
  { label: "Clients", href: "/clients" },
  { label: "Case Studies", href: "/case-studies" },
  // { label: "Services", href: null },
  { label: "Blog", href: "/blog" },
];

/**
 * Full-width sticky top bar, separate from LeftNav's own logo/header.
 * Fixed at h-16 — LeftNav's sticky offset (see its `sticky` prop) is
 * computed against this exact height, so changing it here means updating
 * that offset too. Solid bg-base at every scroll position.
 */
export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-30 h-16 border-b-[0.5px] border-hairline bg-base">
      <div className="flex h-full items-center justify-between gap-6 px-4 desk:px-5">
        <Logo />
        <nav aria-label="Primary" className="hidden items-center gap-6 desk:flex">
          {navLinks.map((item) =>
            item.href ? (
              <Link
                key={item.label}
                href={item.href}
                aria-current={pathname === item.href ? "page" : undefined}
                className={`-mx-1.5 -my-1 px-0.5 py-px font-display text-[13px] font-medium uppercase tracking-[-0.02em] transition-colors hover:bg-accent ${
                  pathname === item.href
                    ? "text-white"
                    : "text-white/70 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            ) : (
              <span
                key={item.label}
                className="cursor-default font-display text-[13px] font-medium uppercase tracking-[-0.02em] text-white/30"
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

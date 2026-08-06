"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Script from "next/script";
import { links } from "@/lib/projects";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";
import { ShuffleText } from "./ShuffleText";
import { TallyPopupLink } from "./TallyPopupLink";

export const navLinks: { label: string; href: string | null }[] = [
  // { label: "About", href: null },
  // { label: "YC Partner", href: null },
  { label: "Explorations", href: "/explorations" },
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
    <>
      {/* Tally's embed script, loaded here rather than in AuditCta because the
          CTA below is in the root layout — it has to open the popup on every
          route, including the ones with no #audit section (/call, /explorations,
          /case-studies/*). Next.js dedupes by src, so the AuditCta button on
          /, /blog and /blog/[slug] rides on this same single load. */}
      <Script src="https://tally.so/widgets/embed.js" strategy="afterInteractive" />
      <header className="sticky top-0 z-30 h-16 border-b-[0.5px] border-hairline bg-base">
        <div className="flex h-full items-center justify-between gap-6 px-4 desk:px-5">
          <Logo />
          <nav aria-label="Primary" className="hidden items-center gap-7 desk:flex">
            {navLinks.map((item) =>
              item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  aria-current={pathname === item.href ? "page" : undefined}
                  className={`-mx-1.5 -my-1 px-0.5 py-[1px] font-display text-[13px] font-medium uppercase tracking-[-0.02em] transition-colors hover:bg-accent ${
                    pathname === item.href
                      ? "text-white"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  <ShuffleText text={item.label} />
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
            <div className="flex items-center gap-2.5">
              {/* Opens the Tally popup in place rather than linking to /#audit:
                  that used to scroll to the section and leave the visitor to
                  press a second button to get the same form. whitespace-nowrap
                  because this label is long enough to wrap into a two-line
                  button at the narrow end of the desktop range. */}
              <TallyPopupLink className="flex items-center gap-1 whitespace-nowrap rounded-none bg-button-dark px-3 py-2 font-display text-[12px] font-medium uppercase tracking-[-0.12px] text-white transition-colors hover:bg-white/12">
                <span>Get a perception audit</span>
                <Image src="/media/Container.svg" alt="" width={14} height={14} aria-hidden="true" />
              </TallyPopupLink>
              <a
                href={links.discoveryCall}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 whitespace-nowrap rounded-none bg-accent px-3 py-2 font-display text-[12px] font-medium uppercase tracking-[-0.12px] text-white transition-colors hover:brightness-110"
              >
                <span>Book A Call</span>
                <Image src="/media/Container.svg" alt="" width={14} height={14} aria-hidden="true" />
              </a>
            </div>
          </nav>
          <MobileMenu />
        </div>
      </header>
    </>
  );
}


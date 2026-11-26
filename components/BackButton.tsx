"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { cameFromWithinSite } from "@/lib/route-history";

export function BackButton({
  href = "/",
  label = "Back",
  icon = "chevron",
  preferHistory = false,
}: {
  /** Return to the page the visitor came from when that was another page of
      this site (a case study opened from the homepage goes back to the
      homepage, scroll position included). `href` stays the fallback for a
      direct visit, and what crawlers and new-tab clicks follow. */
  preferHistory?: boolean;
  href?: string;
  label?: string;
  /** "chevron" — the usual back-arrow stroke icon. "arrow" — the back-btn
      icon from public/media. */
  icon?: "chevron" | "arrow";
}) {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <Link
      href={href}
      aria-label={label}
      onClick={(event) => {
        // Leave modified clicks (new tab, new window) to the link itself.
        if (!preferHistory || event.metaKey || event.ctrlKey || event.shiftKey) return;
        if (!cameFromWithinSite(pathname)) return;
        event.preventDefault();
        router.back();
      }}
      className="-ml-1 inline-flex h-8 w-8 items-center justify-center text-white/60 transition-colors hover:text-white"
    >
      {icon === "arrow" ? (
        <Image src="/media/back-btn.svg" alt="" width={10} height={10} aria-hidden="true" />
      ) : (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M19 12H5m0 0 6-6m-6 6 6 6"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </Link>
  );
}

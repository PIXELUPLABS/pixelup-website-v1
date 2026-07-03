import Image from "next/image";
import Link from "next/link";
import navLogo from "@/public/media/nav-logo.svg";

export function Logo() {
  // Single SVG lockup (mark + wordmark) — replaces the old PNG mark + HTML text.
  return (
    <Link href="/" className="flex items-center" aria-label="PIXELUP LABS home">
      {/* The SVG has ~6.7 viewBox-units of left whitespace baked in (≈4.7px at
          this size); the negative margin pulls the visible mark flush with the
          container edge so it lines up with the heading below. */}
      <Image
        src={navLogo}
        alt="PIXELUP LABS"
        priority
        className="-ml-[4.7px] h-[28px] w-auto"
      />
    </Link>
  );
}

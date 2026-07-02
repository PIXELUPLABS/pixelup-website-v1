import Image from "next/image";
import Link from "next/link";
import navLogo from "@/public/media/nav-logo.svg";

export function Logo() {
  // Single SVG lockup (mark + wordmark) — replaces the old PNG mark + HTML text.
  return (
    <Link href="/" className="flex items-center" aria-label="PIXELUP LABS home">
      <Image
        src={navLogo}
        alt="PIXELUP LABS"
        priority
        className="h-[28px] w-auto"
      />
    </Link>
  );
}

import Image from "next/image";
import Link from "next/link";
import navLogo from "@/public/media/pixelup-logo.svg";

export function Logo() {
  // Square icon mark (no wordmark baked in, unlike the old lockup) — no left
  // whitespace to compensate for, so no negative margin needed here.
  return (
    <Link href="/" className="flex items-center" aria-label="PIXELUP LABS home">
      <Image src={navLogo} alt="PIXELUP LABS" priority className="h-7 w-auto" />
    </Link>
  );
}

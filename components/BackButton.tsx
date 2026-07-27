import Image from "next/image";
import Link from "next/link";

export function BackButton({
  label = "Back",
  icon = "chevron",
}: {
  label?: string;
  /** "chevron" — the usual back-arrow stroke icon. "arrow" — the back-btn
      icon from public/media. */
  icon?: "chevron" | "arrow";
}) {
  return (
    <Link
      href="/"
      aria-label={label}
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

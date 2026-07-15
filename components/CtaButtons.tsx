import Link from "next/link";
import { links } from "@/lib/projects";

function PaperPlaneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M22 2 11 13M22 2l-7 20-4-9-9-4 20-7Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowUpRightIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 17 17 7M8 7h9v9"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const baseButton =
  "flex flex-1 items-center justify-between rounded-[2px] px-3 py-[11.5px] " +
  "font-button text-[12px] font-semibold tracking-[-0.12px] text-white transition-colors";

export function CtaButtons() {
  return (
    // Mobile: two-up side by side. Desktop: stacked, full width.
    <div className="flex flex-row gap-2.5 desk:flex-col">
      <a
        href={links.telegram}
        target="_blank"
        rel="noopener noreferrer"
        className={`${baseButton} bg-button-dark hover:bg-white/[0.12]`}
      >
        <span>CHAT ON TELEGRAM</span>
        <PaperPlaneIcon />
      </a>
      <Link
        href={links.bookCall}
        className={`${baseButton} bg-accent hover:brightness-110`}
      >
        <span>START YOUR PROJECT</span>
        <ArrowUpRightIcon />
      </Link>
    </div>
  );
}

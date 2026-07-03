import type { CaseStudy } from "@/lib/case-studies";
import { CaseMediaSlot } from "./CaseMedia";
import { SectionShell } from "./SectionShell";

function QuoteMarkIcon() {
  return (
    <svg
      width="23"
      height="20"
      viewBox="0 0 23 20"
      fill="none"
      aria-hidden="true"
      className="text-accent"
    >
      <path
        d="M0 20V11.5C0 5.1 3.4 1.2 9.4 0l1.2 3.2C7 4.3 5.4 6.4 5.2 9.3H10V20H0Zm12.6 0V11.5C12.6 5.1 16 1.2 22 0l1 3.2c-3.5 1.1-5.1 3.2-5.3 6.1h4.8V20H12.6Z"
        fill="currentColor"
      />
    </svg>
  );
}

/** Founder quote section: image, quote mark, pull quote, attribution. */
export function CaseQuote({ quote }: { quote: CaseStudy["quote"] }) {
  return (
    <SectionShell heading={quote.heading}>
      <CaseMediaSlot
        slot={quote.image}
        aspect="aspect-square"
        sizes="(min-width: 1200px) 552px, 100vw"
      />
      <blockquote className="mt-2 flex flex-col gap-2">
        <QuoteMarkIcon />
        <p className="text-[20px] leading-[1.3] tracking-[-0.02em] text-white desk:text-[24px]">
          {quote.text}
        </p>
      </blockquote>
      {/* mt-2 tops up the shell's 20px gap to 28px, matching the image→quote gap. */}
      <div className="mt-2 flex flex-col gap-1">
        <p className="text-[16px] leading-[1.3] tracking-[-0.02em] text-white">
          {quote.name}
        </p>
        <p className="text-[12px] uppercase leading-[1.3] tracking-[0.2em] text-white/40">
          {quote.role}
        </p>
      </div>
    </SectionShell>
  );
}

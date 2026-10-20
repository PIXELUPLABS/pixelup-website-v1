import Link from "next/link";
import type { InlineCta as InlineCtaData } from "@/lib/case-studies";

/** The closing sentence of a case study, ending in an inline link
 * ("Want to talk about your own brand? Book a call."). */
export function InlineCta({
  cta,
  className,
}: {
  cta: InlineCtaData;
  className: string;
}) {
  return (
    <p className={className}>
      {cta.text}{" "}
      <Link
        href={cta.href}
        className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
      >
        {cta.label}
      </Link>
      .
    </p>
  );
}

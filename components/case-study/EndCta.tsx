import type { CaseStudy } from "@/lib/case-studies";
import { BookCallForm } from "../BookCallForm";

/**
 * Page-specific closing CTA, mobile only: on desktop the sticky CaseSidebar
 * already pins the shared CtaButtons, so a second primary action would
 * compete with it. Shared by the legacy and story renderers.
 */
export function EndCta({ endCta }: { endCta: NonNullable<CaseStudy["endCta"]> }) {
  return (
    <div className="border-t-[0.5px] border-hairline p-6 desk:hidden">
      <BookCallForm label={endCta.label} bookingUrl={endCta.href} />
    </div>
  );
}

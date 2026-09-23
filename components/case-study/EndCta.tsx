import Image from "next/image";
import type { CaseStudy } from "@/lib/case-studies";
import { ctaButtonBase, ctaButtonPadding } from "../CtaButtons";

/**
 * Page-specific closing CTA, mobile only: on desktop the sticky CaseSidebar
 * already pins the shared CtaButtons, so a second primary action would
 * compete with it. Shared by the legacy and story renderers.
 */
export function EndCta({ endCta }: { endCta: NonNullable<CaseStudy["endCta"]> }) {
  return (
    <div className="border-t-[0.5px] border-hairline p-6 desk:hidden">
      <a
        href={endCta.href}
        target="_blank"
        rel="noopener noreferrer"
        className={`${ctaButtonBase} ${ctaButtonPadding} w-full bg-accent text-white hover:brightness-110`}
      >
        <span>{endCta.label}</span>
        <Image
          src="/media/Container.svg"
          alt=""
          width={14}
          height={14}
          aria-hidden="true"
        />
      </a>
    </div>
  );
}

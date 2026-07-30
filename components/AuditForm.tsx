import Image from "next/image";
import { AuditCta } from "@/components/AuditCta";
import auditFormBg from "@/public/media/audit-form-bg.png";
import auditFormPattern from "@/public/media/audit-form-pattern.svg";
import dakshImg from "@/public/media/daksh-img.svg";

// The inline six-field form was replaced by a single CTA that opens the audit
// form in a Tally popup, so this is a plain server component now — no state, no
// fetch, no "use client". AuditCta carries the popup's data attributes and the
// embed script; submissions land in Tally rather than app/api/audit.
export function AuditForm() {
  return (
    <section
      id="audit"
      // scroll-mt-16 matches the sticky Navbar's height (h-16) — without it,
      // #audit's anchor scroll lands the section flush at the true viewport
      // top, and the fixed navbar then covers that same 64px, hiding the top
      // of the section.
      className="flex w-full scroll-mt-16 flex-col border-t-[0.5px] border-hairline py-7 desk:h-114"
    >
      <div className="relative h-90 w-full desk:h-full">
        <Image src={auditFormBg} alt="" fill className="object-cover" />
        <Image src={auditFormPattern} alt="" fill className="object-cover opacity-10" />
        <div className="relative flex h-full flex-col justify-between p-6">
          <div className="flex flex-col">
            <div className="relative h-12 w-12 overflow-hidden rounded-full bg-white">
              <Image src={dakshImg} alt="Daksh Aswal" fill className="object-cover" />
            </div>
            <div className="flex flex-col pt-2">
              <p className="font-normal text-white">Daksh Aswal</p>
              <p className="font-normal text-white/60">Founder at PIXELUP LABS</p>
            </div>
          </div>
          {/* Copy left, CTA right and bottom-aligned on desktop; stacked on
              mobile with the button full width. */}
          <div className="flex flex-col gap-6 desk:flex-row desk:items-end desk:justify-between desk:gap-10">
            {/* Setup line steps back to white/60, the punch line holds full white
                — the same opacity hierarchy used for headings site-wide. */}
            <div className="flex flex-col gap-3">
              <p className="tracking-display font-display text-[28px] font-medium leading-[120%] text-white desk:text-[32px]">
                <span className="text-white/60">Your product is enterprise-ready.</span>
                <br />
                Does your site say so?
              </p>
              {/* max-w in ch + text-balance so the two lines carry roughly the
                  same number of words, same as the hero and case-study headings. */}
              <p className="max-w-[68ch] text-balance text-[14px] font-normal leading-[150%] text-white/60">
                Not ready for a call? Get a perception audit instead. We&apos;ll tell you
                honestly what an enterprise buyer sees, and what we&apos;d change.
              </p>
            </div>
            <AuditCta />
          </div>
        </div>
      </div>
    </section>
  );
}

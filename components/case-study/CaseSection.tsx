import type { CaseSection as CaseSectionData } from "@/lib/case-studies";
import { SectionShell } from "./SectionShell";

/** Text section variants: lead + focus list, metric rows, or plain paragraphs. */
export function CaseSection({ section }: { section: CaseSectionData }) {
  return (
    <SectionShell heading={section.heading} headingSize={section.headingSize}>
      {section.lead && (
        <p className="whitespace-pre-line text-[16px] leading-[1.5] text-white">
          {section.lead}
        </p>
      )}

      {section.focus && (
        <div className="flex flex-col gap-3">
          {section.focus.map((item) => (
            <div key={item.title} className="text-[16px] leading-[1.2]">
              <p className="text-white">{item.title}</p>
              <p className="text-white/60">{item.sub}</p>
            </div>
          ))}
        </div>
      )}

      {section.results && (
        <div className="text-[16px] leading-[1.5]">
          {section.results.map((row) => (
            <p key={row.label} className="text-white">
              {row.label} <span className="text-white/60">{row.text}</span>
            </p>
          ))}
        </div>
      )}

      {section.paragraphs?.map((paragraph) => (
        <p key={paragraph} className="text-[16px] leading-[1.5] text-white">
          {paragraph}
        </p>
      ))}

      {section.bullets && (
        <ul className="flex list-none flex-col gap-2 text-[16px] leading-[1.35] text-white">
          {section.bullets.map((item, index) => (
            <li key={item} className="flex gap-3">
              <span aria-hidden="true" className="text-white/40">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </SectionShell>
  );
}

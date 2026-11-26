import Link from "next/link";
import { type Service, serviceHref } from "@/lib/services";
import { noBreakHyphens } from "../SectionRows";
import { ServiceCarousel } from "./ServiceCarousel";

// Moved to components/SectionRows.tsx; re-exported for /services and /yc.
export {
  DetailRow,
  noBreakHyphens,
  SectionHeader,
  type SectionEdge,
} from "../SectionRows";

/**
 * scroll-mt for in-page jumps. Mobile: the Navbar (64px) plus SectionNav's
 * strip (py-3 + a 28px pill + hairline = 116.5px). Desktop: the Navbar, whose
 * hairline is its last 0.5px. Both values put the section's own top hairline
 * exactly behind that bottom rule, so one rule shows with the full 24px of
 * padding below it.
 */
export const sectionScrollMargin = "scroll-mt-[116px] desk:scroll-mt-[63.5px]";

/** Numbered list, same treatment as CaseSection's shipped-work bullets. */
export function Deliverables({ items }: { items: string[] }) {
  return (
    <ul className="flex list-none flex-col gap-2 leading-[1.35]">
      {items.map((item, index) => (
        <li key={item} className="flex gap-3">
          <span aria-hidden="true" className="text-white/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/**
 * One service on the /services index: the name (linking to its detail page),
 * the headline and an optional proof line top-left, the typical timeline
 * bottom-left; the work carousel on the right. Text styles: 32/24px title,
 * 16px white, 16px muted-65, and the 14px timeline line.
 * The title link's ::after stretches over the whole row, so the row is one
 * target; the carousel sits above it (z-10) to keep its own controls. The
 * "View service" text link that sat bottom-left is out for now; the timeline
 * took its place.
 */
export function ServiceSection({ service }: { service: Service }) {
  const titleId = `${service.id}-title`;
  const href = serviceHref(service.id);

  return (
    // The first row drops its top rule below desk: the SectionNav strip's
    // bottom rule already sits right above it.
    <section
      id={service.id}
      aria-labelledby={titleId}
      className={`group/row relative border-t-[0.5px] border-hairline first:border-t-0 desk:first:border-t-[0.5px] ${sectionScrollMargin}`}
    >
      <div className="grid desk:grid-cols-2">
        <div className="flex flex-col justify-between gap-6 p-6">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <h2
                id={titleId}
                className="text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[32px]"
              >
                <Link
                  href={href}
                  className="after:absolute after:inset-0 after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-1 focus-visible:after:-outline-offset-1 focus-visible:after:outline-white/60"
                >
                  {service.name}
                </Link>
              </h2>
              <p className="max-w-[40ch] text-pretty text-[16px] leading-[1.5] text-white">
                {noBreakHyphens(service.headline)}
              </p>
            </div>
            {service.proof && (
              <p className="max-w-[44ch] text-pretty text-[16px] leading-[1.5] text-muted-65">
                {service.proof}
              </p>
            )}
          </div>
          {/* Bottom-left, where the "View service" link sat: the typical
              timeline, at the 14px meta size. Not a link. */}
          <p className="text-[14px] leading-[1.3] tracking-[-0.01em] text-muted-65">
            Timeline <span aria-hidden="true">·</span>{" "}
            <span className="text-white">{service.timeline}</span>
          </p>
        </div>
        <div className="relative z-10 px-6 pb-6 desk:p-6">
          <ServiceCarousel
            label={service.name}
            caption={service.scope}
            href={href}
            slides={service.gallery}
          />
        </div>
      </div>
    </section>
  );
}

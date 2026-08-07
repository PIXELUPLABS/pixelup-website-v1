import Image from "next/image";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import navLogo from "@/public/media/pixelup-logo.svg";
import unionMark from "@/public/media/Vector.svg";

const JOIN_THE_TEAM_URL = "https://tally.so/r/xXE7ry";
const TESTIMONIALS_URL = "https://contra.com/daksh_aswal_dt5tfn27/reviews"

const caseStudies = [
  { name: "Greptile", slug: "greptile" },
  { name: "Sainapse", slug: "sainapse" },
  { name: "Sully", slug: "sully" },
] as const;

const quickLinks = [
  { name: "Explorations", href: "/explorations" },
  { name: "Blog", href: "/blog" },
] as const;

// Outer <footer> has no padding of its own, ever — it always fills exactly
// whatever container it's placed in, the same way every other section
// (BlogList, AuditForm, CaseSection, ...) does. The inner div below is what
// insets the bordered/partitioned card from those outer edges.
export function Footer() {
  return (
    <footer className="relative w-full desk:h-140">
      {/* Inner div: spacing from the outer footer on every side except the
          top (flush there) — desktop only. On mobile the card goes flush
          left/right too, since the wrapper at each call site already
          cancels the page row's own p-5 there. */}
      <div className="relative pb-5 desk:h-full desk:px-5">
        <div className="flex h-full flex-col border-[0.5px] border-hairline desk:grid desk:grid-rows-[3fr_1fr]">
          <div className="grid grid-cols-1 divide-y divide-hairline desk:grid-cols-4 desk:divide-x-0 desk:divide-y-0">
            <div className="flex flex-col gap-6 p-6 desk:h-full desk:justify-between">
              <div className="flex flex-col gap-6">
                <Image src={navLogo} alt="PIXELUP LABS" className="h-8 w-8" />
                <p className="font-normal text-white">
                  We position your brand to <br /> match your ambition
                </p>
              </div>
              <p className="text-[12px] font-normal text-white">©2026 PIXELUP LABS</p>
            </div>
            <div className="flex flex-col gap-8 p-6 desk:h-full desk:border-l-[0.5px] desk:border-hairline">
              <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
                Quick Links
              </p>
              <div className="flex flex-col gap-2">
                {quickLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="w-fit text-[14px] font-normal text-white"
                  >
                    {link.name}
                  </Link>
                ))}
                <a
                  href={JOIN_THE_TEAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-[14px] font-normal text-white"
                >
                  Careers
                </a>
                <a
                  href={TESTIMONIALS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-fit text-[14px] font-normal text-white"
                >
                  Testimonials
                </a>
              </div>
            </div>
            <div className="flex flex-col gap-8 p-6 desk:h-full">
              <p className="text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
                Case Studies
              </p>
              <div className="flex flex-col gap-2">
                {caseStudies.map((study) => (
                  <Link
                    key={study.name}
                    href={`/case-studies/${study.slug}`}
                    className="w-fit text-[14px] font-normal text-white"
                  >
                    {study.name}
                  </Link>
                ))}
              </div>
            </div>
            <div className="flex flex-col gap-8 p-6 desk:h-full desk:border-l-[0.5px] desk:border-hairline">
              {/* No uppercase column label here (unlike the other two columns) —
                  the copy names the newsletter itself. text-pretty keeps the
                  last line from dropping to a single orphaned word. */}
              <p className="text-pretty text-[14px] font-normal leading-[150%] text-white/60">
                A newsletter on the design strategies that are working for enterprise
                companies, written by Daksh. Two emails a month, no spam.
              </p>
              <NewsletterForm />
            </div>
          </div>
          <div className="flex w-full items-center border-t-[0.5px] border-hairline p-6">
            <Image src={unionMark} alt="" className="h-auto w-full" />
          </div>
        </div>
      </div>
    </footer>
  );
}

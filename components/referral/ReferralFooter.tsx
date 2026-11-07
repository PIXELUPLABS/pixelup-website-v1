import Image from "next/image";
import { site } from "@/lib/2027/site";
import { links } from "@/lib/projects";
import logo from "@/public/media/pixelup-logo.svg";

/**
 * /referral's footer, from the PIXELUP Brand 2026 redesign (Figma "Footer /
 * 12 New Business (refined)", node 1801:2563): the 2026 site's new-business
 * footer on a black-to-blue glow, with the email set at display size.
 * Contact data comes from lib/2027/site so it stays in step with /2027.
 */

const imprint = [
  "Brand, websites and motion for AI companies",
  `${site.email}, @dakshpixelup, pixeluplabs.com`,
  "PIXELUP LABS © 2026, all rights reserved",
];

const linkClass = "underline decoration-solid underline-offset-2";

export function ReferralFooter() {
  return (
    <footer className="flex w-full flex-col bg-[linear-gradient(180deg,var(--color-ink-deep)_0%,var(--color-base)_28%,var(--color-glow-1)_50%,var(--color-glow-2)_60%,var(--color-glow-3)_72%,var(--color-glow-4)_86%,var(--color-glow-5)_100%)] p-6">
      <div className="flex w-full items-center justify-between pb-24 desk:pb-[200px]">
        <div className="flex items-center gap-2">
          <Image src={logo} alt="" aria-hidden="true" className="h-[12.65px] w-auto" />
          <p className="text-[12px] font-medium uppercase leading-[15px] tracking-[0.02em] text-white">
            PIXELUP LABS
          </p>
        </div>
        <a
          href="#"
          className="text-[12px] font-medium uppercase leading-[15px] tracking-[0.02em] text-white/60 transition-colors hover:text-white"
        >
          Back to top ↑
        </a>
      </div>

      <div className="flex w-full flex-col gap-3.5 pb-32 desk:pb-[220px]">
        <p className="font-mono text-[10px] uppercase leading-[13px] tracking-[0.06em] text-white/60">
          [New business]
        </p>
        {/* Sized to the viewport so it spans the footer edge to edge (143.5px
            at the 1440 Figma canvas), capped at 179px: SiteFrame stops the
            page at 1800px wide, so beyond that the column no longer grows. */}
        <a
          href={`mailto:${site.email}`}
          className="whitespace-nowrap text-[8.8vw] leading-none tracking-[-0.055em] text-white desk:text-[min(9.965vw,179px)]"
        >
          {site.email}
        </a>
        <div className="flex flex-wrap items-center gap-1.5 pt-1.5">
          <p className="flex items-center gap-2 text-[13px] leading-[16px] tracking-[-0.01em] text-white">
            <span aria-hidden="true" className="text-[9px] tracking-[0.22em]">
              ○●
            </span>
            <span aria-hidden="true" className="h-px w-[21px] bg-white/50" />
            <span>2 slots left for November.</span>
          </p>
          <a
            href={links.bookCall}
            className={`text-[13px] leading-[16px] tracking-[-0.01em] text-white ${linkClass}`}
          >
            Get a free Deal Teardown ↗
          </a>
        </div>
      </div>

      <div className="flex w-full flex-col items-start gap-6 desk:flex-row desk:items-end desk:gap-0">
        <div className="flex flex-wrap items-center gap-[26px] text-[13px] leading-[16px] tracking-[-0.01em] text-on-glow desk:flex-1">
          <a href={`mailto:${site.email}`} className={linkClass}>
            {site.email}
          </a>
          {site.socials
            .filter((social) => social.label !== "LinkedIn")
            .map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {social.label} ↗
              </a>
            ))}
        </div>
        <div aria-hidden="true" className="flex flex-col gap-0.5 desk:items-center">
          <div className="hidden h-[42px] w-[475px] desk:block" />
          <div className="text-[11px] uppercase leading-[1.3] text-on-glow-muted desk:text-center">
            {imprint.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-[26px] text-[13px] leading-[16px] tracking-[-0.01em] text-on-glow desk:flex-1 desk:justify-end">
          {site.legal.map((item) => (
            <a key={item.label} href={item.href} className={linkClass}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

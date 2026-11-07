import Image from "next/image";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { ReferralFooter } from "@/components/referral/ReferralFooter";
import { ReferralForm } from "@/components/referral/ReferralForm";
import { links } from "@/lib/projects";
import { siteUpdated } from "@/lib/site-dates";

const description =
  "Apply to be a PIXELUP LABS partner and earn 15% on every company you refer. VCs get priority for their portfolio companies and free consultations.";

export const metadata: Metadata = {
  title: "Partner Referral Program - PIXELUP LABS",
  description,
  alternates: { canonical: "/referral" },
};

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.pixeluplabs.com/referral/#webpage",
  url: "https://www.pixeluplabs.com/referral/",
  name: "Partner Referral Program - PIXELUP LABS",
  description,
  datePublished: siteUpdated.referral,
  dateModified: siteUpdated.referral,
  isPartOf: { "@id": "https://www.pixeluplabs.com/#website" },
  about: { "@id": "https://www.pixeluplabs.com/#organization" },
};

/*
 * Built from the PIXELUP Brand 2026 redesign (Figma PIXELUP-Brand-2026, node
 * 1801:2472) at its 1440 canvas: 40px side gutters, a 437px label column and
 * a 48px gap on desktop; everything stacks below the `desk` breakpoint.
 */

/* The redesign is set in Inter (not the site's Inter Display), so the page
   loads it to match the Figma line breaks and widths exactly. */
const inter = localFont({
  src: "../fonts/Inter-Variable-latin.woff2",
  weight: "400 500",
  display: "swap",
});
/* The latin subset has no ↗ ○ ●, which the footer uses: this four-glyph
   Inter subset (↗ ○ ● ↑) sits first in the stack and covers only those. */
const interSymbols = localFont({
  src: "../fonts/Inter-Variable-symbols.woff2",
  weight: "400 500",
  display: "swap",
  adjustFontFallback: false,
});
const fontFamily = `${interSymbols.style.fontFamily}, ${inter.style.fontFamily}`;

/** The page's one primary action: the hero's accent button jumps here. */
const APPLY_ID = "apply";
const PARTNER_EMAIL = "daksh@pixeluplabs.com";

const stats = [
  { value: "15%", label: "Partner commission", detail: "On every company you refer to us" },
  {
    value: "90%",
    label: "Of our clients refer us",
    detail: "People who have worked with us send others our way",
  },
  {
    value: "35+",
    label: "Brand and website sprints",
    detail: "For the teams building what comes next in AI",
  },
];

const inlineLink =
  "text-fg underline decoration-solid underline-offset-2 transition-colors hover:text-white";

const methods = [
  {
    title: "Start an email chain",
    text: (
      <>
        Email{" "}
        <a href={`mailto:${PARTNER_EMAIL}`} className={inlineLink}>
          {PARTNER_EMAIL}
        </a>{" "}
        and copy in the company you are referring. We take it from there.
      </>
    ),
  },
  {
    title: "Or have them book a call",
    text: (
      <>
        Ask the company to{" "}
        <a href={links.bookCall} className={inlineLink}>
          book a call with us
        </a>{" "}
        directly and mention your name in the form.
      </>
    ),
  },
];

const buttonBase =
  "flex h-[52px] w-full items-center justify-between rounded-[4px] px-5 text-[15px] leading-[18px] text-fg transition-[filter,background-color] desk:w-60";

function Arrow() {
  return (
    <Image
      src="/media/referral/arrow-right.svg"
      alt=""
      width={16}
      height={16}
      aria-hidden="true"
    />
  );
}

/** Top-ruled label at the head of the left column. */
function LabelRow({ children, index }: { children: React.ReactNode; index?: string }) {
  return (
    <div className="flex w-full items-baseline justify-between border-t border-line pt-4">
      <p className="text-[15px] leading-[18px] text-fg">{children}</p>
      {index && (
        <p aria-hidden="true" className="font-mono text-[12px] leading-[16px] text-faint">
          {index}
        </p>
      )}
    </div>
  );
}

export default function ReferralPage() {
  return (
    <div className="flex flex-col bg-ink" style={{ fontFamily }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main aria-label="Partner referral program" className="flex flex-col">
        {/* Hero: the header's blue fades to black behind the copy. */}
        <section className="relative overflow-clip desk:min-h-[540px] bg-[linear-gradient(180deg,var(--color-glow-top)_0%,var(--color-glow-1)_8%,var(--color-base)_48.5%,var(--color-ink-deep)_100%)] px-4 py-12 desk:px-10">
          <div className="relative flex w-full items-end">
            <Image
              src="/media/referral/ghost-15.svg"
              alt=""
              aria-hidden="true"
              width={828}
              height={382}
              priority
              className="pointer-events-none absolute -top-[9.78px] -right-[67.3px] hidden h-[381.563px] w-[828.09px] max-w-none desk:block"
            />
            <div className="relative flex flex-col gap-7">
              <h1 className="max-w-[620px] text-[48px] leading-[0.94] tracking-[-0.045em] text-fg desk:text-[88px]">
                Apply to be a partner and earn 15%
              </h1>
              <p className="max-w-[560px] text-[17px] leading-[1.5] text-fg desk:text-[19px]">
                If you are a VC, we prioritize your portfolio companies over other projects and
                offer extra benefits, like free consultations for your founders.
              </p>
              <div className="flex flex-col gap-3 desk:flex-row">
                <a
                  href={`#${APPLY_ID}`}
                  className={`${buttonBase} bg-accent-blue font-medium hover:brightness-110`}
                >
                  <span>APPLY AS A PARTNER</span>
                  <Arrow />
                </a>
                <a
                  href={links.bookCall}
                  className={`${buttonBase} border border-line-input bg-surface-2 px-[19px] hover:bg-surface`}
                >
                  <span>QUICK INTRO CHAT</span>
                  <Arrow />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Stats: 1px gaps over the line color draw the cell rules. */}
        <div className="grid gap-px border border-line bg-line desk:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.value}
              className="flex flex-col gap-2.5 bg-ink px-4 pt-8 pb-9 desk:px-10"
            >
              <p className="text-[48px] leading-none tracking-[-0.04em] text-fg desk:text-[64px]">
                {stat.value}
              </p>
              <p className="text-[15px] leading-[18px] text-fg">{stat.label}</p>
              <p className="text-[13px] leading-[16px] text-faint">{stat.detail}</p>
            </div>
          ))}
        </div>

        <section
          aria-labelledby="how-heading"
          className="flex flex-col gap-12 px-4 pt-16 pb-20 desk:flex-row desk:px-10 desk:pt-24 desk:pb-28"
        >
          <div className="w-full desk:w-[437px] desk:shrink-0">
            <LabelRow>How it works</LabelRow>
          </div>
          <div className="flex min-w-0 flex-1 flex-col gap-10">
            <h2
              id="how-heading"
              className="text-[40px] leading-none tracking-[-0.04em] text-fg desk:text-[64px]"
            >
              Refer a company in one of <span className="text-faint">two ways.</span>
            </h2>
            <ol className="flex flex-col gap-4 desk:flex-row">
              {methods.map((method, index) => (
                <li
                  key={method.title}
                  className="flex min-h-[220px] flex-1 flex-col justify-between gap-10 rounded-[6px] border border-line bg-surface p-[27px] desk:h-[280px]"
                >
                  <p aria-hidden="true" className="font-mono text-[11px] leading-[14px] text-faint">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <div className="flex flex-col gap-3.5">
                    <h3 className="text-[28px] leading-[34px] tracking-[-0.04em] text-fg">
                      {method.title}
                    </h3>
                    <p className="text-[16px] leading-[1.55] text-muted">{method.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* scroll-mt-16 clears the sticky navbar when #apply is linked. */}
        <section
          id={APPLY_ID}
          aria-labelledby="apply-heading"
          className="flex scroll-mt-16 flex-col gap-12 border-t border-line px-4 pt-16 pb-20 desk:flex-row desk:px-10 desk:pt-24 desk:pb-[120px]"
        >
          <div className="flex w-full flex-col gap-7 desk:w-[437px] desk:shrink-0">
            <LabelRow index="III">Partner application</LabelRow>
            <h2
              id="apply-heading"
              className="max-w-[384px] text-[40px] leading-[0.98] tracking-[-0.04em] text-fg desk:text-[48px]"
            >
              Apply to become a partner
            </h2>
            <div className="flex flex-col gap-2.5 rounded-[6px] border border-dashed border-line-strong p-[19px] text-muted">
              <p className="text-[12px] leading-[15px] tracking-[0.08em]">PROGRAM TERMS</p>
              <p className="text-[14px] leading-[1.5]">
                [Add the program terms and conduct rules here — the second confirmation below
                refers to them.]
              </p>
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <ReferralForm />
          </div>
        </section>
      </main>
      <ReferralFooter />
    </div>
  );
}

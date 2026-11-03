import type { Metadata } from "next";
import { CaseFaq } from "@/components/case-study/CaseFaq";
import { ContextRows, Metrics } from "@/components/case-study/CaseStudyStory";
import { Emphasis } from "@/components/case-study/Emphasis";
import { SectionShell } from "@/components/case-study/SectionShell";
import { Footer } from "@/components/Footer";
import { LeftNav } from "@/components/LeftNav";
import { ReferralForm } from "@/components/referral/ReferralForm";
import { links } from "@/lib/projects";
import {
  commissionIntro,
  commissionNotes,
  commissionScope,
  commissionTiers,
  conductIntro,
  conductRules,
  eligibility,
  joinSteps,
  partnerPerks,
  partnerTypes,
  payoutIntro,
  payoutTerms,
  programTerms,
  qualifyIntro,
  qualifyNote,
  qualifyRules,
  referralFaq,
  referralFaqHeading,
  referralFaqSchema,
  referralHero,
  referralHighlights,
  referralOverview,
  referralSteps,
} from "@/lib/referral";
import { siteUpdated } from "@/lib/site-dates";

const description =
  "Refer a company that needs brand, product or web design to PIXELUP LABS and earn up to 15% of the net fees we collect. Free to join, no targets, no exclusivity.";

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

/** The page's one primary action: the sidebar's accent button jumps here. */
const APPLY_ID = "apply";

const bodyText = "text-[16px] leading-[1.5] text-muted-65";

/**
 * The case-study story's vertical center rule, scoped to a run of
 * SectionShell blocks. Broken between runs because the 3-up Metrics strips
 * between them have column rules at thirds, which a 50% rule would cut through.
 */
function CenterRuled({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-1/2 hidden border-l-[0.5px] border-hairline desk:block"
      />
      <div className="relative flex flex-col gap-6">{children}</div>
    </div>
  );
}

/** Numbered step rows: ContextRows' hairline rhythm with CaseSection's
 * muted two-digit index. */
function Steps({ steps }: { steps: { title: string; text: string }[] }) {
  return (
    <ol className="flex flex-col divide-y-[0.5px] divide-hairline">
      {steps.map((step, index) => (
        <li key={step.title} className="flex gap-4 py-4 first:pt-0 last:pb-0">
          <span
            aria-hidden="true"
            className="w-5 shrink-0 font-mono text-[12px] leading-[1.6] text-white/40"
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="flex flex-col gap-2">
            <p className="text-[14px] leading-[1.3] tracking-[-0.01em] text-white">
              {step.title}
            </p>
            <p className={bodyText}>{step.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ReferralPage() {
  return (
    <div className="relative">
      <div className="relative flex flex-col gap-8 p-4 desk:flex-row desk:items-start desk:gap-0 desk:p-5">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(referralFaqSchema) }}
        />
        <LeftNav
          sticky
          balanceHero
          heading={referralHero.heading}
          subheading={
            <>
              The PIXELUP LABS partner program is{" "}
              <strong className="font-medium text-white">
                free to join, with no targets and no exclusivity
              </strong>
              . You make a warm introduction, we run the pitch, and{" "}
              <strong className="font-medium text-white">
                you earn on every payment the client makes
              </strong>
            </>
          }
          primaryCta={{ label: "APPLY AS A PARTNER", href: `#${APPLY_ID}` }}
        />
        <div
          aria-hidden="true"
          className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
        />
        <main
          aria-label="Partner referral program"
          className="flex min-w-0 flex-1 flex-col gap-8"
        >
          {/* Bleeds past the shell's padding (left on mobile, right on
              desktop) so hairlines run edge to edge and the sections' own
              24px padding sets the text inset, as on case study pages. */}
          <div className="-mx-4 flex flex-col gap-6 desk:mx-0 desk:-mr-5 desk:pb-6">
            <CenterRuled>
              <SectionShell heading="Warm introductions, shared results" contentInset="wide">
                {referralOverview.map((paragraph) => (
                  <p key={paragraph} className={bodyText}>
                    <Emphasis text={paragraph} />
                  </p>
                ))}
              </SectionShell>
            </CenterRuled>

            {/* bottomRule off + -mb-6: the next section's top rule closes the
                cells, the same hand-off ResultsBlock uses. */}
            <div className="fade-up -mb-6 [animation-delay:300ms]">
              <Metrics metrics={referralHighlights} bottomRule={false} />
            </div>

            <CenterRuled>
              <SectionShell heading="Who can join" topRule contentInset="wide">
                <p className={bodyText}>
                  Anyone with a genuine relationship to a potential client. Most partners
                  come from four groups.
                </p>
                <ContextRows
                  items={partnerTypes.map((type) => ({
                    label: type.label,
                    text: `${type.who}. **Typical referral:** ${type.referral.charAt(0).toLowerCase()}${type.referral.slice(1)}.`,
                  }))}
                />
                <p className="border-t-[0.5px] border-hairline pt-4 text-[14px] leading-[1.4] text-white/60">
                  {eligibility}
                </p>
              </SectionShell>

              <SectionShell heading="How it works" topRule contentInset="wide">
                <p className={bodyText}>
                  A referral moves from introduction to payout in six steps.
                </p>
                <Steps steps={referralSteps} />
              </SectionShell>

              <SectionShell heading="Commission tiers" topRule contentInset="wide">
                <p className={bodyText}>
                  <Emphasis text={commissionIntro} />
                </p>
                <p className={bodyText}>
                  <Emphasis text={commissionNotes.tiers} />
                </p>
              </SectionShell>
            </CenterRuled>

            <div className="-mb-6">
              <Metrics metrics={commissionTiers} bottomRule={false} />
            </div>

            <CenterRuled>
              <SectionShell heading="What commission is paid on" topRule contentInset="wide">
                <ContextRows
                  items={[
                    ...commissionScope,
                    { label: "Worked example", text: commissionNotes.example },
                    { label: "Option for VCs", text: commissionNotes.vc },
                  ]}
                />
              </SectionShell>

              <SectionShell heading="Partner perks and support" topRule contentInset="wide">
                <p className={bodyText}>
                  Beyond commission, we give you the tools to refer with confidence.
                </p>
                <ContextRows items={partnerPerks} />
              </SectionShell>

              <SectionShell heading="Payout terms" topRule contentInset="wide">
                <p className={bodyText}>
                  <Emphasis text={payoutIntro} />
                </p>
                <ContextRows items={payoutTerms} />
              </SectionShell>

              <SectionShell heading="Qualified referrals" topRule contentInset="wide">
                <p className={bodyText}>
                  <Emphasis text={qualifyIntro} />
                </p>
                <ContextRows items={qualifyRules} />
                <p className="border-t-[0.5px] border-hairline pt-4 text-[14px] leading-[1.4] text-white/60">
                  {qualifyNote}
                </p>
              </SectionShell>

              <SectionShell heading="Partner conduct" topRule contentInset="wide">
                <p className={bodyText}>{conductIntro}</p>
                <ContextRows items={conductRules} />
              </SectionShell>

              <SectionShell heading="Program terms" topRule contentInset="wide">
                <ContextRows items={programTerms} />
              </SectionShell>

              <SectionShell heading={referralFaqHeading} topRule contentInset="wide">
                <CaseFaq items={referralFaq} />
              </SectionShell>

              {/* Application: copy left, form right, split on the center rule.
                  scroll-mt-16 clears the sticky navbar when #apply is linked. */}
              <section
                id={APPLY_ID}
                aria-labelledby="apply-heading"
                className="scroll-mt-16 border-t-[0.5px] border-hairline"
              >
                <div className="grid desk:grid-cols-2">
                  <div className="flex flex-col gap-6 p-6 desk:sticky desk:top-16 desk:self-start">
                    <p className="font-mono text-[12px] uppercase leading-none tracking-wide text-white/40">
                      Partner application
                    </p>
                    <h2
                      id="apply-heading"
                      className="max-w-[16ch] text-balance text-[24px] font-medium leading-tight tracking-display text-white desk:text-[48px]"
                    >
                      Apply to become a partner
                    </h2>
                    <Steps steps={joinSteps} />
                    <p className="text-[14px] leading-[1.4] text-white/60">
                      Questions before you apply?{" "}
                      <a
                        href={links.telegram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-white underline decoration-white/40 underline-offset-4 transition-colors hover:decoration-white"
                      >
                        Message us on Telegram
                      </a>
                      .
                    </p>
                  </div>
                  <div className="border-t-[0.5px] border-hairline p-6 desk:border-t-0">
                    <ReferralForm />
                  </div>
                </div>
              </section>
            </CenterRuled>
          </div>

          {/* Same wrapper as /clients: cancels the row's padding so Footer
              fills the column via its own w-full. */}
          <div className="-mx-4 -mb-4 desk:-mr-5 desk:-mb-5 desk:-ml-4">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

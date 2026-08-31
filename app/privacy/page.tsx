import type { Metadata } from "next";
import { Footer } from "@/components/Footer";
import { LeftNav } from "@/components/LeftNav";
import { sitePublished, siteUpdated } from "@/lib/site-dates";

/**
 * CONFIRM BEFORE THIS GOES LIVE — these three values are the only things on
 * this page that weren't derivable from the codebase, and all three are
 * legally load-bearing:
 *
 *  - LEGAL_ENTITY  the registered company name, not the brand name.
 *  - CONTACT_EMAIL the address that actually receives privacy requests.
 *                  Seeded with the repo's committing address as a working
 *                  placeholder; swap it for a monitored inbox.
 *  - The retention and jurisdiction language in §8 is deliberately generic.
 *
 * Everything else (the processor list in §5, the RB2B wording in §3) is
 * sourced from what the site actually loads or from the vendor's own
 * required text.
 */
const LEGAL_ENTITY = "PIXELUP LABS";
const CONTACT_EMAIL = "design@pixelup.in";

const schema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": "https://www.pixeluplabs.com/privacy/#webpage",
  url: "https://www.pixeluplabs.com/privacy/",
  name: "Privacy Policy - PIXELUP LABS",
  description:
    "How PIXELUP LABS collects, uses and shares information about visitors to pixeluplabs.com.",
  datePublished: sitePublished,
  dateModified: siteUpdated.privacy,
  isPartOf: { "@id": "https://www.pixeluplabs.com/#website" },
  about: { "@id": "https://www.pixeluplabs.com/#organization" },
};

export const metadata: Metadata = {
  title: "Privacy Policy - PIXELUP LABS",
  description:
    "How PIXELUP LABS collects, uses and shares information about visitors to pixeluplabs.com.",
  alternates: { canonical: "/privacy" },
};

/**
 * Section wrapper for this page only. The site has no long-form prose
 * component — CaseSection and SectionShell both hardcode the case-study
 * 50/50 split, which a single-column legal document can't use. Structure
 * comes from a top hairline rule per section, matching the site's
 * dividers-not-cards rule rather than introducing a bordered card.
 */
function PolicySection({
  index,
  title,
  children,
}: {
  index: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-t-[0.5px] border-hairline pt-8">
      <div className="flex flex-col gap-2">
        <p className="font-mono text-[12px] font-medium uppercase tracking-[0.04em] text-label-grey">
          {String(index).padStart(2, "0")}
        </p>
        <h2 className="font-display tracking-display text-[20px] font-medium leading-[1.2] text-white desk:text-[24px]">
          {title}
        </h2>
      </div>
      <div className="flex flex-col gap-4 text-[16px] leading-[1.6] tracking-[-0.01em] text-muted-65">
        {children}
      </div>
    </section>
  );
}

/** Prose link treatment — underline only, so the page introduces no colour
 *  beyond the existing text tokens (the accent stays reserved for CTAs). */
function PolicyLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-white underline decoration-white/30 underline-offset-4 transition-colors hover:decoration-white"
    >
      {children}
    </a>
  );
}

export default function PrivacyPage() {
  return (
    <div className="relative">
      <div className="relative flex flex-col gap-8 p-4 desk:flex-row desk:items-start desk:gap-0 desk:p-5">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
        {/* No TrustedStrip here, same call as /clients: the logo marquee is a
            proof element and has no business on a legal page. */}
        <LeftNav
          sticky
          balanceHero
          showTrustedStrip={false}
          headingSize="desk:text-[40px]"
          heading="Privacy Policy"
          subheading={
            <>
              How we collect, use and share information about the people who
              visit{" "}
              <strong className="font-medium text-white">pixeluplabs.com</strong>.
            </>
          }
        />
        <div
          aria-hidden="true"
          className="hidden desk:mx-4 desk:-my-5 desk:block desk:self-stretch desk:border-l-[0.5px] desk:border-hairline"
        />
        <main className="flex min-w-0 flex-1 flex-col gap-8">
          <article className="flex flex-col gap-8">
            <p className="text-[13px] font-medium uppercase tracking-[0.04em] text-label-grey">
              Last updated {siteUpdated.privacy}
            </p>

            <PolicySection index={1} title="Who we are">
              <p>
                {LEGAL_ENTITY} is a design studio. This policy covers
                pixeluplabs.com and the forms, booking pages and newsletter we
                run on it. It does not cover the separate products or websites
                of the clients whose work we show here.
              </p>
              <p>
                If you contact us about your data, write to{" "}
                <PolicyLink href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </PolicyLink>
                .
              </p>
            </PolicySection>

            <PolicySection index={2} title="Information you give us">
              <p>
                You give us information directly when you submit a form, book a
                discovery call, or subscribe to the newsletter. Depending on the
                form, that can include your name, email address, company,
                website, and whatever you write in the message field.
              </p>
              <p>
                We use it to reply to you, run the engagement you asked about,
                and send the newsletter you subscribed to. You can unsubscribe
                from the newsletter at any time using the link in any email.
              </p>
            </PolicySection>

            <PolicySection
              index={3}
              title="Information collected automatically, and visitor identification"
            >
              <p>
                When you visit the site we automatically collect standard
                technical information: IP address, browser and device type,
                referring page, and the pages you view. We use cookies and
                similar technologies to do this.
              </p>
              {/* Wording below is RB2B's required disclosure, reproduced
                  verbatim from support.rb2b.com/en/articles/8795972 — do not
                  paraphrase it, the opt-out URL included. */}
              <p>
                When you visit or log in to our website, cookies and similar
                technologies may be used by our online data partners or vendors
                to associate these activities with other personal information
                they or others have about you, including by association with
                your email. We (or service providers on our behalf) may then
                send communications and marketing to these email addresses. You
                may opt out of receiving this advertising by visiting{" "}
                <PolicyLink href="https://app.retention.com/optout">
                  https://app.retention.com/optout
                </PolicyLink>
                .
              </p>
            </PolicySection>

            <PolicySection index={4} title="How we use this information">
              <p>
                We use it to operate and improve the site, understand which
                pages and case studies people actually read, respond to
                enquiries, and reach out to companies that show interest in our
                work. We do not sell your personal information.
              </p>
            </PolicySection>

            <PolicySection index={5} title="Third parties we share data with">
              <p>
                The site loads or sends data to the following services, each
                under its own privacy policy:
              </p>
              <ul className="flex list-disc flex-col gap-2 pl-5 marker:text-white/30">
                <li>
                  <span className="text-white">Google Analytics</span> —
                  aggregate traffic and behaviour analytics.
                </li>
                <li>
                  <span className="text-white">DataFast</span> — privacy-focused
                  site analytics.
                </li>
                <li>
                  <span className="text-white">RB2B</span> — identifies
                  companies and contacts visiting the site, as described in
                  section 03.
                </li>
                <li>
                  <span className="text-white">Tally</span> — the enquiry and
                  audit forms.
                </li>
                <li>
                  <span className="text-white">Cal.com</span> — discovery-call
                  booking.
                </li>
                <li>
                  <span className="text-white">Supabase</span> — stores
                  newsletter subscriptions.
                </li>
                <li>
                  <span className="text-white">Vercel</span> — hosting and
                  request logs.
                </li>
              </ul>
            </PolicySection>

            <PolicySection index={6} title="Your choices">
              <p>
                You can opt out of the visitor identification described in
                section 03 at{" "}
                <PolicyLink href="https://app.retention.com/optout">
                  app.retention.com/optout
                </PolicyLink>
                .
              </p>
              <p>
                You can opt out of the collection of your personal data under
                GDPR at{" "}
                <PolicyLink href="https://www.rb2b.com/rb2b-gdpr-opt-out">
                  rb2b.com/rb2b-gdpr-opt-out
                </PolicyLink>
                .
              </p>
              <p>
                Most browsers let you block or delete cookies. Blocking them may
                break parts of the site, such as the booking embed.
              </p>
            </PolicySection>

            <PolicySection index={7} title="Your rights">
              <p>
                Depending on where you live, you may have the right to access,
                correct, delete, or export the personal information we hold
                about you, and to object to how we use it. Email{" "}
                <PolicyLink href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </PolicyLink>{" "}
                and we will action it.
              </p>
            </PolicySection>

            <PolicySection index={8} title="Retention">
              <p>
                We keep enquiry and booking information for as long as we need
                it to run the relationship it relates to, and newsletter
                subscriptions until you unsubscribe. Analytics data is retained
                according to each provider&rsquo;s own retention settings.
              </p>
            </PolicySection>

            <PolicySection index={9} title="Changes to this policy">
              <p>
                We update this page when what we collect or who we share it with
                changes. The date at the top reflects the most recent update.
              </p>
            </PolicySection>
          </article>
          <div className="-mx-4 -mb-4 desk:-mr-5 desk:-mb-5 desk:-ml-4">
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { CaseFaq } from "@/components/case-study/CaseFaq";
import { SectionShell } from "@/components/case-study/SectionShell";
import { CtaButtons } from "@/components/CtaButtons";
import { Footer } from "@/components/Footer";
import { SectionNav } from "@/components/SectionNav";
import {
  ServiceSection,
  noBreakHyphens,
  sectionScrollMargin,
} from "@/components/services/ServiceSection";
import { TrustedStrip } from "@/components/TrustedStrip";
import {
  idealClient,
  services,
  servicesFaq,
  servicesFaqSchema,
  servicesPageNav,
} from "@/lib/services";
import { siteUpdated } from "@/lib/site-dates";

const SITE_URL = "https://www.pixeluplabs.com";
const PAGE_URL = `${SITE_URL}/services`;
const title = "Services - PIXELUP LABS";
const description =
  "Brand, website, product, motion and build for B2B startups going upmarket. One senior team, 2 to 5 weeks. Book a call.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/services" },
  // Staging-only for now, like /2027: not linked from the nav or footer, not
  // in the sitemap, and kept out of the index until it goes live.
  robots: { index: false, follow: false },
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${PAGE_URL}#webpage`,
      url: PAGE_URL,
      name: title,
      description,
      // First published with this page; dateModified follows lib/site-dates.ts.
      datePublished: "2026-09-30",
      dateModified: siteUpdated.services,
      isPartOf: { "@id": "https://www.pixeluplabs.com/#website" },
      about: { "@id": "https://www.pixeluplabs.com/#organization" },
      mainEntity: { "@id": `${PAGE_URL}#services` },
    },
    {
      "@type": "ItemList",
      "@id": `${PAGE_URL}#services`,
      name: "PIXELUP LABS services",
      numberOfItems: services.length,
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "Service",
          "@id": `${PAGE_URL}#${service.id}`,
          name: service.name,
          serviceType: service.name,
          description: service.headline,
          // The row on this page: the detail pages don't exist yet.
          url: `${PAGE_URL}#${service.id}`,
          provider: { "@id": "https://www.pixeluplabs.com/#organization" },
        },
      })),
    },
  ],
};

/**
 * Desktop-only sticky sidebar, CaseSidebar's frame (405px, hairline right
 * edge, flush under the Navbar): the section index on top, the trusted-by
 * strip and the site's Book a call buttons pinned to the bottom. Below desk
 * the index moves to SectionNav's strip and the buttons live in the hero.
 */
function ServicesSidebar() {
  return (
    <aside className="hidden desk:block desk:w-[405px] desk:shrink-0 desk:border-r-[0.5px] desk:border-hairline">
      <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col">
        <div className="no-scrollbar flex min-h-0 flex-1 flex-col justify-between gap-8 overflow-y-auto py-6">
          <div className="fade-up flex flex-col gap-3 [animation-delay:100ms]">
            <p className="px-5 font-mono text-[12px] uppercase leading-none tracking-wide text-muted-40">
              On this page
            </p>
            <SectionNav items={servicesPageNav} variant="list" />
          </div>
          <div className="fade-up flex flex-col gap-5 px-5 [animation-delay:200ms]">
            <TrustedStrip />
            <CtaButtons />
          </div>
        </div>
      </div>
    </aside>
  );
}

/** StoryHero's structure: eyebrow, display H1, one-line sub. Below desk the
 * sidebar is hidden, so the trusted-by strip and the CTAs follow the sub. */
function ServicesHero() {
  return (
    <section className="flex flex-col gap-6 p-6 pb-12">
      <p className="fade-up font-mono text-[12px] uppercase leading-none tracking-wide text-muted-40 [animation-delay:100ms]">
        Services
      </p>
      {/* One sentence per line from desk up (the first is ~830px at 64px,
          so it balances onto two lines below ~1330px). "bake-off." is
          nowrap so it never splits at the hyphen. */}
      <h1 className="fade-up text-balance text-[32px] font-medium leading-[1.05] tracking-display text-white [animation-delay:200ms] desk:text-[64px]">
        Your product wins the <span className="whitespace-nowrap">bake-off.</span>
        <br className="hidden desk:inline" /> Then the deal goes quiet.
      </h1>
      <p className="fade-up max-w-[48ch] text-pretty text-[16px] leading-[1.4] tracking-[-0.02em] text-muted-65 [animation-delay:300ms] desk:text-[20px]">
        We rebuild brand, website and product around your market opinion,{" "}
        <strong className="font-medium text-white">
          so enterprise buyers stop hesitating.
        </strong>{" "}
        One senior team, 2 to 5 weeks.
      </p>
      <div className="fade-up flex flex-col gap-6 [animation-delay:400ms] desk:hidden">
        <TrustedStrip />
        <CtaButtons />
      </div>
    </section>
  );
}

/** SectionShell, like the FAQ below it, with ClientInfo's label | value rows. */
function WhoWeWorkWith() {
  return (
    <div id="who-we-work-with" className={sectionScrollMargin}>
      <SectionShell
        heading={idealClient.heading}
        topRule
        headingSize="compact"
        contentInset="wide"
      >
        <p className="max-w-[60ch] text-[16px] leading-[1.5] text-muted-65">
          {idealClient.line}
        </p>
        <dl className="flex flex-col divide-y-[0.5px] divide-hairline">
          {idealClient.rightFit.map((row) => (
            <div
              key={row.label}
              className="flex py-3 text-[14px] tracking-[-0.01em] first:pt-0 last:pb-0"
            >
              <dt className="w-[104px] shrink-0 leading-[1.3] text-muted-65">{row.label}</dt>
              <dd className="min-w-0 flex-1 leading-[1.3] text-white">
                {noBreakHyphens(row.text)}
              </dd>
            </div>
          ))}
        </dl>
      </SectionShell>
    </div>
  );
}

/**
 * Case-study page shell (full bleed, sticky 405px sidebar, one <main>), not
 * the homepage's LeftNav shell: a five-service page needs a persistent section
 * index, and the hero copy is longer than the LeftNav sidebar holds.
 */
export default function ServicesPage() {
  return (
    <div className="relative">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(servicesFaqSchema) }}
      />
      <div className="relative flex flex-col desk:flex-row">
        <ServicesSidebar />

        <main className="min-w-0 flex-1">
          <ServicesHero />
          <SectionNav items={servicesPageNav} variant="strip" />

          {/* Vertical center rule behind the two-column rows, same as the
              case study story layout. */}
          <div className="relative pb-6">
            <div
              aria-hidden="true"
              className="absolute inset-y-0 left-1/2 hidden border-l-[0.5px] border-hairline desk:block"
            />
            <div className="relative flex flex-col gap-6">
              {services.map((service) => (
                <ServiceSection key={service.id} service={service} />
              ))}

              <WhoWeWorkWith />

              <div id="faq" className={sectionScrollMargin}>
                <SectionShell
                  heading="Frequently asked questions"
                  topRule
                  headingSize="compact"
                  contentInset="wide"
                >
                  <CaseFaq items={servicesFaq} />
                </SectionShell>
              </div>
            </div>
          </div>

          {/* Closing CTA below desk, where the sidebar's buttons aren't on screen. */}
          <div className="border-t-[0.5px] border-hairline p-6 desk:hidden">
            <CtaButtons />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}

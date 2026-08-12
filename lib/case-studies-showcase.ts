/**
 * Extra fields layered on top of `lib/projects.ts` for the /case-studies grid
 * (niche, what-we-did, funding badge, strongest stat). Kept separate from
 * `Project` so the homepage/case-study-page shape stays untouched.
 *
 * Sourcing:
 * - `whatWeDid` is each client's `engagement` line from `lib/clients.ts`
 *   (the /clients roster), the team's own approved scope-of-work copy —
 *   not new copy invented here. lib/clients.ts uses the slug "henrylabs"
 *   for the project this file (and lib/projects.ts) key as "henry-labs";
 *   same company, just a slug mismatch between the two files.
 * - Sainapse / Sully / Streamline stats are pulled verbatim or
 *   near-verbatim from their real case studies in `lib/case-studies.ts` —
 *   no new claims invented here.
 * - Funding badges for CTGT, Reducto, Valley, Revyl, Streamline, Sully, and
 *   Greptile are sourced from public funding announcements (see per-entry
 *   notes below), checked August 2026.
 * - Henry Labs and Sainapse have NO funding badge: public company databases
 *   surfaced funding rounds for similarly-named companies (a CRE startup
 *   also called "Henry AI"; a Bengaluru/Atlanta-based "Sainapse Intelligence"
 *   in data quality) that don't match these clients' actual products
 *   (henrylabs.ai's agentic checkout; sainapse.ai's enterprise support
 *   platform). Rather than risk misattributing a funding round, badge is
 *   omitted until confirmed directly.
 */
export interface CaseStudyShowcaseEntry {
  /** Must match a slug in lib/projects.ts. */
  slug: string;
  niche: string;
  /** Scope of work, from this client's /clients roster entry. */
  whatWeDid: string;
  /** Seed / Pre-Seed / Series A / Series B / Acquired — omit if unconfirmed. */
  fundingBadge?: string;
  /** Strongest proof point, optional. */
  stat?: string;
}

export const caseStudyShowcase: CaseStudyShowcaseEntry[] = [
  {
    slug: "greptile",
    niche: "DevTools",
    whatWeDid: "2026 brand refresh, design system, pitch deck, and ongoing marketing assets",
    fundingBadge: "Series A",
    stat: "$25M raised at a $180M valuation, led by Benchmark",
  },
  {
    slug: "sainapse",
    niche: "Enterprise AI",
    whatWeDid: "Full brand identity and marketing website across two sprints, with Webflow development",
    // No funding badge — see file header note.
    stat: "Deployed by Fortune 500s including Ford, Avery Dennison and Freshworks",
  },
  {
    slug: "sully",
    niche: "Healthcare",
    whatWeDid: "Complete 2025 rebrand covering new identity, guidelines, and website redesign, with Framer development",
    // Series A + $150M valuation confirmed via public funding coverage (Jan 2025).
    fundingBadge: "Series A",
    stat: "Scaled 26x in 11 months, raising $32M+ at a $150M valuation",
  },
  {
    slug: "streamline",
    niche: "Enterprise AI",
    whatWeDid: "Full brand identity, brandbook, and marketing website, with Webflow development",
    // $8.6M Series A led by Blumberg Capital, July 2025 (public announcement).
    fundingBadge: "Series A",
    stat: "One design system shipped across 200+ pages",
  },
  {
    slug: "henry-labs",
    niche: "Consumer AI",
    // lib/clients.ts keys this same client as "henrylabs".
    whatWeDid: "Brand identity, landing page, and product reskin (dashboard + checkout), with Webflow development",
    // No funding badge — see file header note.
  },
  {
    slug: "ctgt",
    niche: "Enterprise AI",
    whatWeDid: "Brand identity, marketing website, product storyboards, and pitch deck, with Webflow development",
    // $7.2M seed led by Gradient (Google's early-stage AI fund), Feb 2025 (public announcement).
    fundingBadge: "Seed",
  },
  {
    slug: "reducto",
    niche: "AI Infrastructure",
    whatWeDid: "Website redesign, brand assets, icon library, and product UI with motion specs, dev-ready",
    // $75M Series B led by a16z, Oct 2025, tripling valuation to $600M (public announcement).
    fundingBadge: "Series B",
  },
  {
    slug: "valley",
    niche: "Enterprise AI",
    whatWeDid: "Brand identity, marketing website, and final sales deck, with Framer development",
    // $3.2M pre-seed (Crunchbase-confirmed).
    fundingBadge: "Pre-Seed",
  },
  {
    slug: "revyl",
    niche: "DevTools",
    whatWeDid: "Brand guidelines, marketing website, product UI redesign, and component library, dev-ready",
    // $1.1M pre-seed, YC-backed (public announcement).
    fundingBadge: "Pre-Seed",
  },
];

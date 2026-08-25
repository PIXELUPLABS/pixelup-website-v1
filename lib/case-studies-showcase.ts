/**
 * Extra fields layered on top of `lib/projects.ts` for the /case-studies grid
 * (niche, what-we-did, funding badge, strongest stat). Kept separate from
 * `Project` so the homepage/case-study-page shape stays untouched.
 *
 * Sourcing:
 * - `whatWeDid` matches `info.involvement` from `lib/case-studies.ts` for
 *   internal case studies. External showcase entries use the approved
 *   `engagement` line from `lib/clients.ts` because they have no detail sidebar.
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
import { caseStudies } from "./case-studies";

export interface CaseStudyShowcaseEntry {
  /** Must match a slug in lib/projects.ts. */
  slug: string;
  /**
   * Card heading — the detail page's h1 (`story.headline`, or `title` for
   * legacy studies, in lib/case-studies.ts). Absent for external showcase
   * entries that have no detail page; the card falls back to the project
   * label.
   */
  title?: string;
  /**
   * Tag text — the detail page's hero status badge (`story.statusBadge` in
   * lib/case-studies.ts) when the study has one; falls back to the funding
   * badge for legacy/external entries.
   */
  badge?: string;
  niche: string;
  /** Scope of work, from this client's /clients roster entry. */
  whatWeDid: string;
  /** Seed / Pre-Seed / Series A / Series B / Acquired — omit if unconfirmed. */
  fundingBadge?: string;
  /** Strongest proof point, optional. */
  stat?: string;
}

const entries: CaseStudyShowcaseEntry[] = [
  {
    slug: "greptile",
    niche: "DevTools",
    whatWeDid: "Brand Identity, Product Design, Website, Sales Decks",
    fundingBadge: "Series A",
    stat: "$25M raised at a $180M valuation, led by Benchmark",
  },
  {
    slug: "sainapse",
    niche: "Enterprise AI",
    whatWeDid: "Brand Identity, Website Design",
    // No funding badge — see file header note.
    stat: "Deployed by Fortune 500s including Ford, Avery Dennison and Freshworks",
  },
  {
    slug: "sully",
    niche: "Healthcare",
    whatWeDid: "Website Design, Product Pages, Motion Design, SEO",
    // Series A + $150M valuation confirmed via public funding coverage (Jan 2025).
    fundingBadge: "Series A",
    stat: "Scaled 26x in 11 months, raising $32M+ at a $150M valuation",
  },
  {
    slug: "streamline",
    niche: "Enterprise AI",
    whatWeDid: "Brand Identity, Positioning, Website Design, Design System",
    // $8.6M Series A led by Blumberg Capital, July 2025 (public announcement).
    fundingBadge: "Series A",
    stat: "One design system shipped across 200+ pages",
  },
  {
    slug: "henrylabs",
    niche: "Consumer AI",
    whatWeDid:
      "Brand identity, Positioning, Website design and build, Product design, Design system, Motion",
    // No funding badge — see file header note.
  },
  {
    slug: "ctgt",
    niche: "Enterprise AI",
    whatWeDid:
      "Brand identity, marketing website, product storyboards, and pitch deck, with Webflow development",
    // $7.2M seed led by Gradient (Google's early-stage AI fund), Feb 2025 (public announcement).
    fundingBadge: "Seed",
  },
  {
    slug: "reducto",
    niche: "AI Infrastructure",
    whatWeDid:
      "Website redesign, brand assets, icon library, and product UI with motion specs, dev-ready",
    // $75M Series B led by a16z, Oct 2025, tripling valuation to $600M (public announcement).
    fundingBadge: "Series B",
  },
  {
    slug: "valley",
    niche: "Enterprise AI",
    whatWeDid:
      "Brand identity, marketing website, and final sales deck, with Framer development",
    // $3.2M pre-seed (Crunchbase-confirmed).
    fundingBadge: "Pre-Seed",
  },
  {
    slug: "revyl",
    niche: "DevTools",
    whatWeDid:
      "Brand guidelines, marketing website, product UI redesign, and component library, dev-ready",
    // $1.1M pre-seed, YC-backed (public announcement).
    fundingBadge: "Pre-Seed",
  },
];

/** slug → detail-page h1, so the /case-studies cards mirror each case study's
 * real headline instead of just the client name. Studies rendered with the
 * newer story hero use `story.headline` as their h1; legacy ones use `title`. */
const detailTitles = new Map(
  Object.values(caseStudies).map((study) => [
    study.slug,
    study.story?.headline ?? study.title,
  ]),
);

/** slug → detail-page hero status badge, so the card tag reads exactly like
 * the tag on the case study itself (e.g. "YC W24 · Series A"). */
const detailBadges = new Map(
  Object.values(caseStudies).map((study) => [
    study.slug,
    study.story?.statusBadge,
  ]),
);

export const caseStudyShowcase: CaseStudyShowcaseEntry[] = entries.map(
  (entry) => ({
    ...entry,
    title: detailTitles.get(entry.slug),
    badge: detailBadges.get(entry.slug) ?? entry.fundingBadge,
  }),
);

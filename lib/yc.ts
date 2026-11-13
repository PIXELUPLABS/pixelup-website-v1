/**
 * Content for /yc, the page for YC founders.
 * On staging only: not on main, not in the sitemap, not linked from the
 * Navbar or Footer until it's approved.
 *
 * Sourcing (no claim on the page goes beyond these):
 * - Batches: each company's page in YC's directory
 *   (ycombinator.com/companies), matched on the client's domain, checked
 *   2026-10-08. Sully is listed as S21: the founder's original batch, which
 *   predates the product (founded 2023). Workers.io's F26 batch is in
 *   progress. Synthio Labs is listed as "Spring 2025", written X25 here
 *   (rechecked 2026-11-12).
 * - FuseAI (W25): its case study is published on main ("YC W25 · AI
 *   sales"), which is where its facts here come from: brand ready on launch
 *   day, 17 days after kickoff; FuseAI reports 20% higher free-to-paid trial
 *   conversion. Its roster row comes from lib/clients.ts (added there
 *   2026-11-13); the copy below only covers a branch without it. Its wordmark (public/media/logos/clients/
 *   fuseai.png, 378x112, transparent) is the header logo from fuseai.com,
 *   downloaded 2026-11-12 with Arjun's OK; swap in an SVG if FuseAI sends
 *   one. Its showcase card comes from lib/projects.ts on main; staging
 *   falls back to a copy.
 * - Rounds: the fundingNote lines in lib/clients.ts, except Greptile and
 *   Revyl. Greptile announced a $50M Series B on 2026-10-19 (Menlo Ventures,
 *   $750M valuation; its own blog and Dealroom), which lib/clients.ts does
 *   not show yet. Revyl's round was $1.1M USD ($1.5M CAD, BetaKit,
 *   2024-10-28), so lib/clients.ts' "$1.5M" overstates it. Audrion's $500K
 *   is the standard YC deal, not a round, so it shows as "Acquired" only.
 * - Totals raised (the first metric), rechecked 2026-11-12. Each is the
 *   lowest figure a public source gives, so the sum is a minimum:
 *   Greptile $79.1M ($4.1M seed + $25M Series A + $50M Series B);
 *   Bland $100M (its Series C release: "surpasses $100 million in total
 *   funding"); Reducto $108M (its own releases; an unannounced $51M B-1 in
 *   Forge data is left out); Sully $30.5M (aggregators give $30.5M to
 *   $34.9M; its case study says $32M+); Autumn $6.7M (one report; the
 *   roster line keeps lib/clients.ts' "$7M Raised"). CTGT, Monumint, Revyl
 *   and Synthio Labs have one public round each. DayFlow, Workers.io and
 *   Audrion have no public figure and add nothing.
 * - Greptile and Sully results, and the referral line: their case studies and
 *   pixelupFaq in lib/case-studies.ts.
 * - Deliverables: the engagement lines of the YC clients in lib/clients.ts.
 * - Who you work with: pixelupFaq ("How do we work together day to day?").
 * - FAQ and process: pixelupFaq and lib/process.ts, reworded for YC teams
 *   with the facts above. No timing, price or step is new.
 */
import { pixelupFaq, type CaseMetric, type FaqItem } from "./case-studies";
import { clients, type Client } from "./clients";
import { processSection, type ProcessContent } from "./process";
import { projects, type Project } from "./projects";
import { testimonials, type Testimonial } from "./testimonials";

interface YcRecord {
  /** YC batch code: W, X (spring), S or F, then the two-digit year. */
  batch: string;
  /** Latest public round, as the roster shows it. */
  round?: string;
  /** Total public funding in $M, every round counted (see the header for
      each source). Left out where no figure is public. */
  totalM?: number;
}

const ycRecords: Record<string, YcRecord> = {
  greptile: { batch: "W24", round: "$50M Series B", totalM: 79.1 },
  bland: { batch: "S23", round: "$50M Series C", totalM: 100 },
  reducto: { batch: "W24", round: "$75M Series B", totalM: 108 },
  sully: { batch: "S21", round: "$22M Series A", totalM: 30.5 },
  fuseai: { batch: "W25" },
  ctgt: { batch: "F24", round: "$7.2M Seed", totalM: 7.2 },
  "autumn-pricing": { batch: "S25", round: "$7M Raised", totalM: 6.7 },
  monumint: { batch: "W24", round: "$3.2M Raised", totalM: 3.2 },
  revyl: { batch: "F24", round: "$1.1M Pre-Seed", totalM: 1.1 },
  dayflow: { batch: "S24" },
  "synthio-labs": { batch: "X25", round: "$5M Seed", totalM: 5 },
  "workers-io": { batch: "F26" },
  audrion: { batch: "F25", round: "Acquired" },
};

/** "YC W24 · $50M Series B": the line under a logo or a work card's title. */
function ycLine({ batch, round }: YcRecord) {
  return round ? `YC ${batch} · ${round}` : `YC ${batch}`;
}

/** FuseAI's roster row for a branch whose lib/clients.ts has none (staging
    has one since 2026-11-13). Engagement from its case study's involvement
    line. */
const fuseaiClient: Client = {
  slug: "fuseai",
  name: "FuseAI",
  logo: "/media/logos/clients/fuseai.png",
  niche: "AI Sales",
  // main's lib/clients.ts line, word for word.
  engagement:
    "Complete 2026 rebrand covering a new logo, website, product UI, and motion design",
};

/** FuseAI sits after Sully, with the other clients that have a case study. */
const rosterSource: Client[] = clients.some((c) => c.slug === "fuseai")
  ? clients
  : clients.flatMap((c) => (c.slug === "sully" ? [c, fuseaiClient] : [c]));

/** YC clients in the /clients roster's order, with the YC line swapped in. */
export const ycClients: Client[] = rosterSource
  .filter((client) => client.slug in ycRecords)
  .map((client) => ({ ...client, fundingNote: ycLine(ycRecords[client.slug]) }));

/** W24 → 2024.0, X25 → 2025.25, S25 → 2025.5, F24 → 2024.75. */
function batchOrder(batch: string) {
  return 2000 + Number(batch.slice(1)) + "WXSF".indexOf(batch[0]) / 4;
}

const batches = [...new Set(Object.values(ycRecords).map((r) => r.batch))].sort(
  (a, b) => batchOrder(a) - batchOrder(b),
);

/** Sum of the totals above, rounded down to the nearest $10M: a minimum,
    since each total is the lowest sourced figure and three have none. */
const raisedM =
  Math.floor(
    Object.values(ycRecords).reduce((sum, r) => sum + (r.totalM ?? 0), 0) / 10,
  ) * 10;

/**
 * The proof band under the featured card. The first two are computed from
 * the records above, so they can't drift from the roster. The raised total
 * leads because it is the widest value: the band's first cell is the only
 * one wide enough for it at 1200px. It carries no "+" for the same reason,
 * so the detail line says it is a minimum.
 */
export const ycMetrics: CaseMetric[] = [
  {
    value: `$${raisedM}M`,
    label: "Raised by our YC clients",
    detail: "At least, in public funding to date",
  },
  {
    value: String(ycClients.length),
    label: "YC companies",
    detail: `${batches.length} batches, ${batches[0]} to ${batches.at(-1)}`,
  },
  {
    value: "2×",
    label: "Greptile demo requests",
    detail: "In the first week after launch",
  },
  {
    value: "26×",
    label: "Sully's growth",
    detail: "In 11 months after its redesign",
  },
];

/**
 * YC work that has showcase media, as homepage ProjectCards with the YC line
 * as the tagline. [lib/projects.ts slug, lib/clients.ts slug]. Greptile leads
 * and is the page's featured card; the rest follow the roster's order.
 */
const ycWorkSlugs: [project: string, client: string][] = [
  ["greptile", "greptile"],
  ["fuseai", "fuseai"],
  ["reducto", "reducto"],
  ["sully", "sully"],
  ["ctgt", "ctgt"],
  ["autumn", "autumn-pricing"],
  ["monumint", "monumint"],
];

/** main's lib/projects.ts entry for FuseAI, used while staging has none. */
const fuseaiProject: Project = {
  slug: "fuseai",
  label: "FuseAI",
  href: "/case-studies/fuseai",
  external: false,
  media: { type: "image", src: "/media/fuseai.webp" },
  alt: "FuseAI's two-stripe mark on an off-white brand collage, brand, website and product design by PIXELUP LABS",
  services: ["Branding", "Website Design", "Product Design"],
  year: "2026",
};

const ycWork: Project[] = ycWorkSlugs.flatMap(([projectSlug, clientSlug]) => {
  const project =
    projects.find((p) => p.slug === projectSlug) ??
    (projectSlug === "fuseai" ? fuseaiProject : undefined);
  return project
    ? [{ ...project, tagline: ycLine(ycRecords[clientSlug]) }]
    : [];
});

export const [ycFeaturedWork, ...ycMoreWork] = ycWork;

/** The YC clients with a published testimonial. Greptile leads, as on /call. */
export const ycTestimonials: Testimonial[] = [
  testimonials.greptile,
  testimonials["synthio-labs"],
];

export const ycRoster = {
  heading: "YC companies we work with",
  intro: `${ycClients.length} companies across ${batches.length} batches, from teams still in batch to a Series C. Under each logo is **its batch and its latest public round**.`,
};

export const ycMoreWorkSection = {
  heading: "More work for YC companies",
  intro:
    "Brand, website and product for more of the roster. Each one opens **the live site or the full case study**.",
};

export const ycWhy = {
  heading: "Backed by YC. Judged like everyone else.",
  // No intro: Arjun asked for the heading alone (2026-11-13).
  rows: [
    {
      label: "The proof",
      body: "Greptile had YC backing and strong technology, but gaps in product clarity and brand maturity surfaced as it moved upmarket. We designed the brand, product, website and sales assets as one system. Demo requests doubled in week one, and within six months Greptile raised **a $25M Series A at a $180M valuation**, led by Benchmark. In October 2026 it raised a $50M Series B at a $750M valuation.",
      link: { label: "Read the Greptile case study", href: "/case-studies/greptile" },
    },
    {
      label: "The referrals",
      body: "Greptile began **referring us to other YC founders**. One introduction turned into several, and that work became the foundation for long-term partnerships across the YC ecosystem.",
    },
    {
      label: "Who you work with",
      body: "You work directly with Daksh, your creative director and point of contact, backed by a small senior team. **No account managers, no layers.**",
    },
  ],
  deliverablesLabel: "What you get",
  deliverables: [
    "Brand identity and guidelines",
    "Marketing website, built in Framer, Webflow or Next.js",
    "Product UI and design system",
    "Pitch and sales decks",
    "Launch and social assets",
  ],
};

/**
 * The process section for YC teams: lib/process.ts' five steps and timings,
 * reworded around a batch and a date. The only added facts are FuseAI's 17
 * days (its case study) and dev-ready handover (the Reducto and Revyl
 * engagement lines). One `**phrase**` a step, as in lib/process.ts.
 */
export const ycProcess: ProcessContent = {
  heading: "How it runs for a YC team",
  // No intro: Arjun asked for the heading alone (2026-11-13). The timings
  // are on each step and in the FAQ.
  steps: [
    {
      ...processSection.steps[0],
      title: "Discovery call",
      body: "You tell us your batch, your buyer and the date you are working to, and we tell you **honestly what we'd change**. Once you sign, we open a shared Slack channel and usually kick off that week or the next.",
    },
    {
      ...processSection.steps[1],
      title: "Founder workshop and strategy",
    },
    {
      ...processSection.steps[2],
      body: "You see **three directions**, each shown on a website hero, poster and product screen, not just a moodboard. FuseAI (YC W25) had its brand ready on launch day, 17 days after kickoff.",
    },
    processSection.steps[3],
    {
      ...processSection.steps[4],
      body: "We build in Webflow, Framer or Next.js, or hand dev-ready files to your engineers. Every launch includes **10 days of post-launch support**.",
    },
  ],
};

/** A shared answer, reused so price and terms can't drift from pixelupFaq. */
function sharedAnswer(q: string) {
  return pixelupFaq.find((item) => item.q === q)!;
}

/** The page's FAQ: the questions a YC founder asks, answered from the facts
    above and the shared FAQ. The page builds its FAQPage JSON-LD from this. */
export const ycFaq: FaqItem[] = [
  {
    q: "Which YC companies has PIXELUP LABS worked with?",
    a: `${ycClients.length} so far, across ${batches.length} batches from ${batches[0]} to ${batches.at(-1)}. They include Greptile, Bland, Reducto, Sully, FuseAI and CTGT.`,
  },
  {
    q: "What results have your YC clients seen?",
    a: "Greptile doubled demo requests in week one and raised a $25M Series A within six months of launch, then a $50M Series B in October 2026. Sully scaled 26x in 11 months after its redesign. FuseAI reports 20% higher free-to-paid trial conversion.",
  },
  {
    q: "Do you work with companies that are still in batch?",
    a: "Yes. Our YC clients run from Workers.io, in the F26 batch now, to Bland at Series C.",
  },
  {
    q: "Can you ship before Demo Day or a launch date?",
    a: "Tell us the date on the first call. A brand sprint takes 2–4 weeks, and a brand and website project takes 6–8 weeks from kickoff to launch. FuseAI's brand was ready on launch day, 17 days after kickoff.",
  },
  sharedAnswer("How much does it cost?"),
  {
    q: "Who do we work with day to day?",
    a: "You work directly with Daksh, your creative director and point of contact, backed by a small senior team. No account managers, no layers. We work in one shared Slack channel, post written updates every Tuesday and Friday and meet for a 30–60 minute sync each week.",
  },
  {
    q: "We already have a brand and website from our batch. Do we need to start over?",
    a: sharedAnswer("We already have a brand and website. Do we need to start over?").a,
  },
  {
    q: "How do YC founders find you?",
    a: "It started with a referral. After its launch, Greptile began referring us to other YC founders, and one introduction turned into several.",
  },
  {
    q: "How do we get started?",
    a: "Book a discovery call or message us on Telegram, and tell us your batch. We will review where you are today and tell you honestly what we would change.",
  },
];

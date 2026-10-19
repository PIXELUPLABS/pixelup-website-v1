// The proposal page types from the 2026 site repo (daksh6131/pixelup-labs-website-2026, src/content/proposals.ts),
// without the client proposals themselves. /process renders one of these through ProposalView.
import type { IconName } from '@/components/2027/proposal/icons';

export type ProposalWeek = { week: number; date?: string; bring: string; decide: string; flag?: string };

/** A deliverable line, optionally with past work that shows what it looks like. */
export type ProposalDeliverable = string | { text: string; reference: { label: string; src: string; alt: string; href?: string } };

/** The page's sections, in the default order. A proposal can reorder or drop them with `order`. */
export type ProposalSection = 'week' | 'split' | 'schedule' | 'deliverables' | 'rules' | 'investment' | 'proof' | 'run' | 'reviews' | 'next' | 'references';

/** An icon list section (the run, the next steps). */
export type ProposalList = { heading: string; intro?: string; items: { label: string; text: string; icon: IconName }[]; line?: string };

export type Proposal = {
  /** Section order; omitted sections are not shown. Defaults to all seven in the usual order. */
  order?: ProposalSection[];
  /** Override a section's eyebrow label. */
  labels?: Partial<Record<ProposalSection, string>>;
  slug: string;
  client: string;
  /** Shown in the header status and the footer CTA. */
  hold: string;
  kicker: string;
  title: string;
  lede: string;
  meta: { label: string; value: string; note?: string; icon: IconName }[];
  /** The weekly time ask. `booking` adds the window the client books the call in (hours in their timezone) and the
   *  minutes it takes; without it the section is the heading and body alone. */
  week?: {
    heading: string;
    body: string;
    booking?: {
      tz: string;
      window: [number, number];
      /** Minutes per week: the review call and the async review. */
      call: number;
      review: number;
      caption: string;
    };
  };
  split: { heading: string; intro?: string; items: { label: string; text: string }[]; line?: string };
  schedule: {
    heading: string;
    body: string;
    /** `note` is the short badge; `detail` an optional line under it. */
    /** Column labels for each week row; default "We bring" / "You decide". */
    labels?: { bring: string; decide: string };
    /** `sum` replaces the calls/hours summary; `bar` the label inside its timeline bar (default: its length in weeks). */
    sprints: { name: string; note: string; detail?: string; sum?: string; bar?: string; from: number; to: number; optional?: boolean; weeks: ProposalWeek[] }[];
    /** Week whose call decides the optional sprint. */
    decideBy?: { week: number; label: string };
    /** Show only the timeline bars, not the week-by-week rows. */
    hideRows?: boolean;
    /** A closing line under the rows; optional. */
    line?: string;
  };
  deliverables?: { heading: string; groups: { name: string; note: string; optional?: boolean; items: ProposalDeliverable[] }[] };
  rules?: { heading: string; intro: string; items: { label: string; text: string; icon: IconName }[] };
  /** Optional extra sections; shown only when listed in `order`. */
  /** The client's own references, the thread through them, and screenshots. */
  references?: {
    heading: string;
    intro: string;
    themes: { label: string; text: string; icon: IconName }[];
    items: { name: string; note: string; href: string; src: string; alt: string }[];
    line?: string;
  };
  run?: ProposalList;
  next?: ProposalList;
  reviews?: { heading: string; body: string; items: { name: string; role: string; quote: string }[]; line?: string };
  investment?: {
    heading: string;
    lead: { name: string; terms: string; price: string; includes: string };
    addons?: { name: string; terms: string; includes: string }[];
    line: string;
  };
  proof?: { heading: string; body: string; items: { client: string; note: string; href: string; src: string; alt: string }[] };
  cta: {
    eyebrow: string;
    email: string;
    note: string;
    /** The deposit link. Until it exists, the button opens an email to Daksh instead. */
    reserve: { label: string; href?: string };
    /** Bank transfer details, a PDF in public/. Shown only once the file is there. */
    ach?: { label: string; href: string };
  };
};

/** The part of a proposal that ProposalView renders. The How we work page is one of these, with no client or ask. */
export type ProposalContent = Omit<Proposal, 'slug' | 'client' | 'hold' | 'cta'>;

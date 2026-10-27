import type { FaqItem } from "@/lib/case-studies";
import { siteUpdated } from "@/lib/site-dates";

export interface FaqCategory {
  /** Tab id, also the URL hash that opens it (/faq#pricing). */
  id: string;
  label: string;
  items: (FaqItem & { id: string })[];
}

export const faqCategories: FaqCategory[] = [
  {
    id: "fit",
    label: "Fit",
    items: [
      {
        id: "what-does-pixelup-labs-do",
        q: "What does PIXELUP LABS do?",
        a: "PIXELUP LABS is a design studio for funded B2B startups, most of them AI-native. It designs brand identity, websites and product UI, including the positioning and messaging behind them, and builds websites in Webflow, Framer or Next.js. It also works on retainer for ongoing product and marketing design.",
      },
      {
        id: "who-does-pixelup-labs-work-with",
        q: "Who does PIXELUP LABS work with?",
        a: "PIXELUP LABS works with funded B2B software companies, most of them AI-native, that sell to enterprise buyers or are about to. The typical client is at Series A or B and moving upmarket. PIXELUP LABS has completed 35 projects.\n\nClients include Greptile (its 2025 rebrand and design system), Reducto, Bland, Sully, Streamline and FuseAI.",
      },
      {
        id: "who-is-pixelup-labs-not-a-fit-for",
        q: "Who is PIXELUP LABS not a fit for?",
        a: "PIXELUP LABS is not the right fit for:\n- Teams that are pre-product or still finding product-market fit.\n- Budgets under $15,000 for a brand, or under $25,000 for brand and website.\n- Teams whose strategy and designs are final and only need execution.\n- Projects where sign-off runs through a steering committee or procurement.\n- Lead generation, SEO or paid ads.\n- Multi-year overhauls of complex enterprise software.\n- High-volume production, such as dozens of ad variants a month.",
      },
      {
        id: "can-pixelup-labs-design-for-a-technical-product",
        q: "Can PIXELUP LABS design for a technical product?",
        a: "Yes. PIXELUP LABS has designed for technical products sold to technical buyers, including Greptile (its 2025 rebrand and design system), Reducto, Bland and CTGT. Every project starts with a kickoff call and a branding workshop that pin down what the product does and the message the brand has to carry.",
      },
      {
        id: "will-a-new-brand-and-website-help-us-close",
        q: "Will a new brand and website help us close enterprise deals?",
        a: "Not on its own. A new brand and website from PIXELUP LABS are built so enterprise buyers stop hesitating before they book the demo. The product and the sales team still close the deal.",
      },
    ],
  },
  {
    id: "pricing-scope",
    label: "Pricing & Scope",
    items: [
      {
        id: "how-much-does-pixelup-labs-cost",
        q: "How much does PIXELUP LABS cost?",
        a: "PIXELUP LABS charges $15,000 for a brand sprint, from $20,000 for a website-only sprint, $25,000 to $40,000 for a brand and website project, and from $6,000 a month for a retainer. Prices are published on [Contra](https://contra.com/daksh_aswal_dt5tfn27/services).",
      },
      {
        id: "are-pixelup-labs-prices-fixed",
        q: "Are PIXELUP LABS prices fixed?",
        a: "Yes. PIXELUP LABS charges a fixed fee for an agreed scope, set in a written proposal before you sign. If you ask for something outside that scope mid-project, PIXELUP LABS quotes it before starting, and you decide whether it goes ahead.",
      },
      {
        id: "does-pixelup-labs-build-the-website",
        q: "Does PIXELUP LABS build the website?",
        a: "Yes. A PIXELUP LABS brand and website project includes the build, in Webflow, Framer or Next.js, with a CMS where you need one.\n\nYour own developers can build from PIXELUP LABS designs instead. Of the 17 website projects PIXELUP LABS finished between September 2025 and October 2026, client teams built 3 and split 1 with PIXELUP LABS.",
      },
      {
        id: "what-is-the-smallest-budget-pixelup-labs-works-with",
        q: "What is the smallest budget PIXELUP LABS works with?",
        a: "$15,000. The brand sprint is the smallest fixed project PIXELUP LABS takes on. For ongoing work, retainers start at $6,000 a month.",
      },
      {
        id: "do-we-need-a-full-rebrand-or-a-refresh",
        q: "Do we need a full rebrand or a refresh?",
        a: "Usually not. Most teams with a working brand and website need a refresh, and PIXELUP LABS does both.\n\nA refresh keeps your positioning and updates how the brand looks; FuseAI kept its original logo, which PIXELUP LABS refined. A full rebrand changes the positioning, and sometimes the name. Which one you need is decided on the discovery call.",
      },
      {
        id: "who-writes-the-website-copy",
        q: "Who writes the website copy?",
        a: "Usually you do, with PIXELUP LABS' help. On all 17 website projects PIXELUP LABS finished between September 2025 and October 2026, the client wrote or signed off the final copy, and PIXELUP LABS drafted first passes on 5.\n\nPIXELUP LABS provides a copy-structure template and edits the copy for your buyer. Writing every page from scratch is included only when the proposal names it.",
      },
      {
        id: "does-pixelup-labs-offer-retainers",
        q: "Does PIXELUP LABS offer retainers?",
        a: "Yes. PIXELUP LABS retainers start at $6,000 a month, with no minimum term. They cover ongoing design work: long-term product design, monthly marketing creative such as posts and ads, or both. The same team that runs PIXELUP LABS sprints does the work. Pricing above $6,000 depends on the scope, agreed in writing before you sign.",
      },
    ],
  },
  {
    id: "timeline-process",
    label: "Timeline & Process",
    items: [
      {
        id: "how-long-does-a-brand-and-website-project-take",
        q: "How long does a brand and website project take?",
        a: "6–8 weeks from kickoff to launch. Across seven PIXELUP LABS brand and website projects, the median was 7.6 weeks. Larger sites, product UI or heavy motion take longer, with the timeline set in the proposal.",
      },
      {
        id: "can-pixelup-labs-deliver-before-our-launch-or-funding",
        q: "Can PIXELUP LABS deliver before our launch or funding announcement?",
        a: "Yes, if the scope fits the time left. PIXELUP LABS plans backward from your date: a brand sprint takes 2–4 weeks and a brand and website project 6–8 weeks from kickoff. At least 6 of PIXELUP LABS' 35 projects were timed to a funding announcement or raise.\n\nCount back from your date using the top of each range, and allow time before kickoff for the first call, the proposal, and the contract and deposit. If the date is closer than the full scope allows, the brand and the pages people see on the day ship first.",
      },
      {
        id: "what-is-the-pixelup-labs-process",
        q: "What is the PIXELUP LABS process?",
        a: "A PIXELUP LABS brand and website project runs 6–8 weeks:\n- Week 1: kickoff, research into your category and competitors, and a 60–90 minute branding workshop with Daksh.\n- Weeks 2–3: brand directions, then logo and identity. The brand is typically final by the end of week 3.\n- Then the website: site structure and copy, wireframes, homepage, inner pages, build, QA and launch.\n- After launch: 10 days of dev support for bug fixes, when PIXELUP LABS builds the site.",
      },
      {
        id: "how-do-we-start-working-with-pixelup-labs",
        q: "How do we start working with PIXELUP LABS?",
        a: "Book a 45-minute call with Daksh at [pixeluplabs.com/call](/call), or message him on Telegram. After the call, PIXELUP LABS sends a written proposal with the scope, timeline and team. Signing the contract and paying the deposit reserves your start date.",
      },
    ],
  },
  {
    id: "working-together",
    label: "Working Together",
    items: [
      {
        id: "who-does-the-work-on-a-pixelup-labs-project",
        q: "Who does the work on a PIXELUP LABS project?",
        a: "Daksh Aswal, PIXELUP LABS' founder and creative director, leads every project and reviews all work before it reaches you. Two senior designers, one on brand and one on web, and a developer do the work with him, and they stay the same from start to finish. A project owner manages the timeline.",
      },
      {
        id: "how-does-pixelup-labs-communicate-during-a-project",
        q: "How does PIXELUP LABS communicate during a project?",
        a: "Through a shared Slack channel, with two written progress updates a week and one 30-minute review call a week. Reviews arrive as Figma links with a note on what changed. PIXELUP LABS replies to questions within one business day.",
      },
      {
        id: "does-pixelup-labs-work-with-us-time-zones",
        q: "Does PIXELUP LABS work with US time zones?",
        a: "Yes. PIXELUP LABS works with US teams on Pacific-time overlap. Live time is one 30-minute call a week in a fixed slot. Everything else runs async in Slack, with replies within one business day.",
      },
      {
        id: "how-many-revision-rounds-are-included",
        q: "How many revision rounds are included?",
        a: "Two rounds per stage: directions, identity, copy, homepage, inner pages and build. A round is one consolidated list of feedback from your team. A third round is outside the agreed scope and is quoted before work starts. PIXELUP LABS doesn't offer unlimited revisions.",
      },
      {
        id: "what-if-we-don-t-like-the-first-concepts",
        q: "What if we don't like the first concepts?",
        a: "Send PIXELUP LABS one list of what missed, and the next set of directions uses one of the two revision rounds included at that stage. If you can't pinpoint why, PIXELUP LABS walks you through the thinking behind each direction on the weekly call.",
      },
      {
        id: "who-owns-the-work-after-the-project-ends",
        q: "Who owns the work after the project ends?",
        a: "You do. At launch, or at final handoff on a brand-only sprint, the final brand, guidelines, design system, Figma files, code and platform accounts transfer to you. Commercial font licenses are the exception: you buy those directly.",
      },
    ],
  },
  {
    id: "proof",
    label: "Proof",
    items: [
      {
        id: "what-results-have-pixelup-labs-clients-seen",
        q: "What results have PIXELUP LABS clients seen?",
        a: "Greptile says demo bookings doubled after the 2025 rebrand and website went live; that rebrand and design system were PIXELUP LABS work. FuseAI reports free-to-paid trial conversion 20% higher since PIXELUP LABS redesigned its brand, website and product (FuseAI's own figure, shared in October 2026). Both figures are the clients' own, not PIXELUP LABS measurements.",
      },
      {
        id: "where-can-we-read-reviews-of-pixelup-labs",
        q: "Where can we read reviews of PIXELUP LABS?",
        a: "On [Contra](https://contra.com/daksh_aswal_dt5tfn27/reviews) and Clutch. Every public review of PIXELUP LABS is 5.0: eight on Contra and one on Clutch, as of October 2026.",
      },
      {
        id: "is-a-ten-person-studio-a-risk-compared-with",
        q: "Is a ten-person studio a risk compared with a larger agency?",
        a: "Not for a brand sprint or a brand and website project. PIXELUP LABS is a ten-person studio: a small senior team does the work, and founder Daksh Aswal directs every project. A larger agency is the better choice when the work spans many products and stakeholders, such as brand architecture, multi-brand systems or M&A integration.",
      },
      {
        id: "can-we-talk-to-a-past-pixelup-labs-client",
        q: "Can we talk to a past PIXELUP LABS client?",
        a: "Not on request. PIXELUP LABS doesn't keep a reference list. Founders have reviewed it publicly:\n- Brendan Mahony, Replay's CEO, [on X](https://x.com/bmaho2211/status/2110720543313768555): “PIXELUP LABS nailed our brand + website + component library. Best agency I've ever worked with.”\n- David Walsh, Limelight's CEO, [on LinkedIn](https://www.linkedin.com/posts/david-walsh-limelight_12-weeks-ago-i-hired-these-four-lads-from-activity-7479919098047389696-UaPB): “over the last 12 years, I've worked with: Big-name website agencies. 'Top-rated' Upwork freelancers. Designers with huge followings. And none came close.”\n- Saurav Bubber, FuseAI's CEO: “Good creative judgement as a team with strong branding expertise.”",
      },
    ],
  },
];

/** Answer text for JSON-LD: links keep their label, list lines become sentences. */
function plainAnswer(a: string) {
  return a
    .replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1")
    .split(/\n+/)
    .map((line) => line.trim().replace(/^- /, ""))
    .filter(Boolean)
    .join(" ");
}

/** FAQPage structured data covering every question on every tab. */
export const faqPageSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "@id": "https://www.pixeluplabs.com/faq/#webpage",
  url: "https://www.pixeluplabs.com/faq",
  name: "FAQ - PIXELUP LABS",
  datePublished: siteUpdated.faq,
  dateModified: siteUpdated.faq,
  isPartOf: { "@id": "https://www.pixeluplabs.com/#website" },
  about: { "@id": "https://www.pixeluplabs.com/#organization" },
  mainEntity: faqCategories.flatMap((category) =>
    category.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: plainAnswer(item.a) },
    })),
  ),
};

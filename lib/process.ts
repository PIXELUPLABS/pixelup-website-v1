/**
 * "What it looks like working with us": the process section on the homepage
 * and every case study (components/ProcessSection.tsx).
 *
 * Cut from the sales-call copy in the Growth workspace
 * (SEO-AEO/Article Writing Workspace/outputs/sales-call-insights-2026-11/
 * process-section-copy.md), which keeps the source for every claim, so each
 * right-hand paragraph fits four lines in the 1440px layout (five at most).
 * No new claims were added. Timings follow a brand and website project (6–8 weeks);
 * the brand sprint and website-only variants live in that file too. Its
 * "Brand and website design · Weeks 3–6" step is split in two here; the
 * 3–4 / 4–6 split follows the brand sprint finishing in weeks 3–4, and no
 * call gives it exactly.
 *
 * `**phrase**` renders in white (components/case-study/Emphasis), so readers
 * can skim the white phrases alone.
 */

export type ProcessStep = {
  title: string;
  /** Mono label at the right of the title. */
  timing: string;
  body: string;
};

export type ProcessPrinciple = {
  /** Rendered in white, ahead of the muted text. */
  lead: string;
  text: string;
};

export const processSection = {
  heading: "What it looks like working with us",
  intro:
    "You **sign off the strategy** before we commit to a direction, and see real directions before we polish one. **No surprises** at launch. The steps below follow a brand and website project: **6–8 weeks** from kickoff to launch. Brand sprints take 2–4 weeks.",
  steps: [
    {
      title: "Discovery call and proposal",
      timing: "Before kickoff",
      body: "We check we're a fit. You tell us your buyer, competitors, deadline and what success looks like; we tell you **honestly what we'd change**. Once you sign and pay the deposit, we open a shared Slack channel. Kickoff is usually **that week or the next**.",
    },
    {
      title: "Buyer and product research",
      timing: "Week 1",
      body: "Under NDA if you like, we learn your product from your engineers and **study your sales and demo calls** for what makes buyers trust you. A 1–3 hour founder workshop sets where you're headed, and we audit **competitors' ads, pages and messaging**.",
    },
    {
      title: "Strategy deck",
      timing: "End of week 1",
      body: "We boil it down to one short deck: where your buyer's needs, your market gap and your vision meet. You sign it off, and we **check every design decision against it**. That **keeps bias out**, ours included.",
    },
    {
      title: "Three directions",
      timing: "Week 2",
      body: "One direction would just be our taste, so you see three. Each has a moodboard, positioning line, storyline and rough versions of a **website hero, poster and product screen**. Pick one, or **mix parts**.",
    },
    {
      title: "Brand design",
      timing: "Weeks 3–4",
      body: "We **test the direction** on real touchpoints: a LinkedIn post, a poster and your product screens. We polish it only once it holds up there.",
    },
    {
      title: "Website design",
      timing: "Weeks 4–6",
      body: "Once the direction is set, we plan the website so every reader, **from the CFO to security**, finds what they need in 5–7 seconds. You write the copy with our template, we edit it, and you **approve wireframes and copy** before final design.",
    },
    {
      title: "Build, launch and handoff",
      timing: "Weeks 6–8",
      body: "We build in Webflow, Framer or Next.js, so **no design decision gets lost**, and hand over the whole system so even non-designers stay on brand. Every launch includes **10 days of post-launch support**.",
    },
  ] satisfies ProcessStep[],
  principlesHeading: "How we work together",
  principles: [
    {
      lead: "You work with Daksh.",
      text: "Your creative director and point of contact, backed by a small senior team. No account managers, no layers. Tag Daksh on Slack.",
    },
    {
      lead: "You always know where things stand.",
      text: "One shared Slack channel, written updates every Tuesday and Friday, a 30–60 minute weekly sync and the live Figma file, any time.",
    },
    {
      lead: "You sign off every stage, with two revision rounds each.",
      text: "Strategy, direction, and wireframes and copy each need your OK. A round is one combined feedback list from your team.",
    },
  ] satisfies ProcessPrinciple[],
};

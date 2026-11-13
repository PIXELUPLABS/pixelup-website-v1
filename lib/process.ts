/**
 * "What it looks like working with us": the process section on the homepage
 * and every case study (components/ProcessSection.tsx).
 *
 * Cut from the sales-call copy in the Growth workspace
 * (SEO-AEO/Article Writing Workspace/outputs/sales-call-insights-2026-11/
 * process-section-copy.md), which keeps the source for every claim, down to
 * two short sentences a step (three lines in the 1440px layout, four at most).
 * No new claims were added. Timings follow a brand and website project (6–8 weeks);
 * the brand sprint and website-only variants live in that file too. Its six
 * steps are regrouped into five here: research and the strategy deck make
 * the brand workshop; three directions and the brand half of "Brand and
 * website design · Weeks 3–6" make the brand sprint. The 2–4 / 4–6 split
 * follows the brand sprint finishing in weeks 3–4, and no call gives it
 * exactly. Its "How we work together" terms moved to the shared FAQ
 * (pixelupFaq in lib/case-studies.ts).
 *
 * `**phrase**` renders in white (components/case-study/Emphasis). One phrase
 * a step, so the white phrases read as the process on their own.
 */

export type ProcessStep = {
  title: string;
  /** Mono label at the right of the title. */
  timing: string;
  body: string;
};

/** What ProcessSection renders: this file's copy, or a page's own (/yc). */
export type ProcessContent = {
  heading: string;
  /** Lead copy under the heading. /yc leaves it out: heading, then steps. */
  intro?: string;
  steps: ProcessStep[];
};

export const processSection = {
  heading: "What it looks like working with us",
  intro:
    "A brand and website project takes **6–8 weeks** from kickoff to launch; a brand sprint on its own takes 2–4 weeks. You sign off the strategy before we commit to a direction, so there are **no surprises** at launch.",
  steps: [
    {
      title: "Discovery and kickoff",
      timing: "Before week 1",
      body: "You tell us your buyer, competitors and deadline, and we tell you **honestly what we'd change**. Once you sign, we open a shared Slack channel and usually kick off that week or the next.",
    },
    {
      title: "Brand workshop and strategy",
      timing: "Week 1",
      body: "We study your product, sales calls and competitors, then run a 1–3 hour founder workshop. It ends in **a strategy deck you sign off**, and we check every design decision against it.",
    },
    {
      title: "Brand sprint",
      timing: "Weeks 2–4",
      body: "You see **three directions**, each shown on a website hero, poster and product screen, not just a moodboard. Pick one or mix parts, and we polish it once it holds up on real touchpoints.",
    },
    {
      title: "Website design",
      timing: "Weeks 4–6",
      body: "We plan it so every reader, from the CFO to security, finds what they need in 5–7 seconds. You write the copy with our template and edits, then **approve wireframes and copy** before final design.",
    },
    {
      title: "Build, launch and support",
      timing: "Weeks 6–8",
      body: "We build in Webflow, Framer or Next.js, so no design decision gets lost, then hand over the whole system. Every launch includes **10 days of post-launch support**.",
    },
  ] satisfies ProcessStep[],
};

import type { CaseMetric, FaqItem } from "@/lib/case-studies";

/**
 * Copy for /referral, the PIXELUP LABS Partner Referral Program. Sourced from
 * the program document (PIXELUP_LABS_Partner_Referral_Program.pdf, 2026-10-27).
 * Keep this file and the signed partner agreement in sync: if a number changes
 * there, it changes here.
 *
 * `**phrase**` renders as a white highlight through the Emphasis component.
 *
 * Deliberately left out until they are decided (they are placeholders in the
 * source document): the minimum first-contract size, the governing
 * jurisdiction, and the named partner contact.
 */

export const referralHero = {
  heading: "Introduce a company that needs design. Earn up to 15% when it pays",
};

/** Overview strip under the first section. Each figure carries its unit and
 * the window it applies to (DESIGN.md §13: a number is never bare). */
export const referralHighlights: CaseMetric[] = [
  {
    value: "15%",
    label: "Top commission rate",
    detail: "Of net fees collected, on every client you introduce",
  },
  {
    value: "6 months",
    label: "Attribution window",
    detail: "From your introduction to a signed contract",
  },
  {
    value: "60 days",
    label: "To your payout",
    detail: "From each client payment, once the project is signed off",
  },
];

export const referralOverview = [
  "You already sit close to companies that need brand, product or web design. **Introduce them to us warmly, and you share in the result.**",
  "We run discovery, the proposal and the negotiation. You keep your relationship and hear from us at every stage.",
  "The program is **free to join, has no targets and no exclusivity**, and pays on collected revenue, not on signed paperwork.",
];

export const partnerTypes = [
  {
    label: "Growth leads and marketers",
    who: "Heads of growth, performance marketers, fractional CMOs",
    referral: "A client whose funnel or conversion needs a redesign",
  },
  {
    label: "Designers and freelancers",
    who: "Independent designers, developers, smaller studios",
    referral: "A project too large, or outside their skill set",
  },
  {
    label: "VCs and accelerators",
    who: "Partners, platform teams, accelerator programs",
    referral: "Portfolio companies needing brand, product or web design",
  },
  {
    label: "Others",
    who: "Consultants, agencies in adjacent fields, founders, alumni",
    referral: "Any company they know needs design help",
  },
] as const;

export const eligibility =
  "Partners must be at least 18, able to issue an invoice or receive payment legally, and not current employees of PIXELUP LABS.";

export const referralSteps = [
  {
    title: "Apply",
    text: "Fill in the partner application below and sign the program agreement we send back.",
  },
  {
    title: "Register the lead",
    text: "Before or at the introduction, send us the company name, the contact and a short note on what they need.",
  },
  {
    title: "Introduce",
    text: "Make a warm email or call introduction to our team.",
  },
  {
    title: "We pitch and close",
    text: "We run discovery, the proposal and the negotiation, and keep you updated throughout.",
  },
  {
    title: "Client pays and signs off",
    text: "Commission is earned on non-refundable payments, once the client has signed off the project.",
  },
  {
    title: "You get paid",
    text: "We pay your commission within 60 days of receiving each client payment.",
  },
];

/** The three tiers, rendered with the shared Metrics strip. */
export const commissionTiers: CaseMetric[] = [
  {
    value: "10%",
    label: "Referrer",
    detail: "Default for every new partner",
  },
  {
    value: "12.5%",
    label: "Growth Partner",
    detail: "3 or more converted referrals in a rolling 12 months",
  },
  {
    value: "15%",
    label: "Strategic Partner",
    detail:
      "6 or more converted referrals in 12 months, or a signed portfolio agreement (VCs and accelerators)",
  },
];

export const commissionIntro =
  "Commission is a share of **net fees collected**: what the client pays us, excluding taxes such as GST, third-party costs passed through to the client (fonts, stock assets, hosting, ad spend) and refunds.";

export const commissionScope = [
  {
    label: "Fixed-scope projects",
    text: "The **full project fee**, as the client pays each milestone.",
  },
  {
    label: "Retainers",
    text: "The **first 12 months** of retainer fees.",
  },
  {
    label: "Repeat work",
    text: "Any new project the same client signs **within 12 months** of the first contract.",
  },
];

export const commissionNotes = {
  tiers:
    "Tiers are reviewed every quarter. An upgrade applies to referrals that convert after it, not retroactively.",
  example:
    "A Growth Partner refers a startup that signs a brand and website project worth **₹10,00,000 in net fees**. The partner earns 12.5%, or **₹1,25,000**, earned on each milestone payment and released once the client signs off the project.",
  vc: "Instead of cash, a VC partner can pass the commission to the portfolio company as **a discount on its project**.",
};

export const partnerPerks = [
  {
    label: "Partner kit",
    text: "Case studies, a capabilities deck, pricing ranges and an intro email template, so you can refer with confidence.",
  },
  {
    label: "Dedicated contact",
    text: "**One named person** at PIXELUP LABS handles every referral you send.",
  },
  {
    label: "Status updates",
    text: "You hear from us at each stage, from the first call to the signed contract.",
  },
  {
    label: "Free design audit",
    text: "A short audit of a prospect's site or product that you can offer **as a door-opener**.",
  },
  {
    label: "VC portfolio sessions",
    text: "Design office hours or workshops for portfolio founders. **Strategic Partners only.**",
  },
  {
    label: "Recognition",
    text: "With your permission, we credit you in case studies and on our partner page.",
  },
];

export const payoutIntro =
  "We pay commission **within 60 days** of receiving each client payment, once the client has **signed off the project.**";

export const payoutTerms = [
  {
    label: "Pay as the client pays",
    text: "Commission is calculated on each milestone or monthly retainer payment, not upfront on contract value.",
  },
  {
    label: "Project sign-off",
    text: "Commission is released only after the client has **signed off the project.**",
  },
  {
    label: "Invoice",
    text: "You send an invoice for each payout. We share a monthly statement to make this easy.",
  },
  {
    label: "Method",
    text: "Bank transfer in the client's billing currency, or your local currency at the day's rate.",
  },
  {
    label: "Taxes",
    text: "We withhold taxes where the law requires (for example, TDS in India) and issue the certificate. You handle your own tax filings.",
  },
  {
    label: "Clawback",
    text: "Only **non-refundable payments** count toward commission. A payment that can still be refunded earns nothing until it becomes non-refundable.",
  },
  {
    label: "Non-payment",
    text: "If a client never pays, no commission is owed on the unpaid amount.",
  },
];

export const qualifyIntro =
  "A referral qualifies when it is **registered first, introduced warmly, and signs within the attribution window.**";

export const qualifyRules = [
  {
    label: "Registered first",
    text: "Register the lead before or at the introduction. If two partners register the same company, the first registration wins.",
  },
  {
    label: "New to us",
    text: "The company is not a current client, a client from the last 12 months, or already in active conversation with us.",
  },
  {
    label: "Attribution window",
    text: "The client signs **within 6 months** of the introduction. We confirm or decline each registration **within 5 working days.**",
  },
  {
    label: "Minimum deal size",
    text: "The first contract must meet the minimum net fee set out in your partner agreement.",
  },
  {
    label: "Genuine introduction",
    text: "A warm intro to a decision-maker. Cold lists, scraped contacts and self-referrals do not qualify.",
  },
];

export const qualifyNote =
  "If we decline a registration, we tell you why. Disputes are settled by the founders of PIXELUP LABS, whose decision is final.";

export const conductIntro =
  "You represent us when you introduce us, so we ask for honesty and transparency.";

export const conductRules = [
  {
    label: "Disclose the arrangement",
    text: "Tell the referred company that you may earn a referral fee.",
  },
  {
    label: "No promises on our behalf",
    text: "Don't quote prices, timelines or deliverables we have not confirmed.",
  },
  {
    label: "Respect confidentiality",
    text: "Anything you learn about our clients, pricing or work stays private.",
  },
  {
    label: "No spam or misuse of our brand",
    text: "No bulk outreach, paid ads on our brand name, or impersonating our team.",
  },
  {
    label: "No conflicts",
    text: "If you are employed by the referred company, check that your employer allows you to accept a fee.",
  },
  {
    label: "Not an employee",
    text: "Partners are independent and cannot sign contracts or make commitments for PIXELUP LABS.",
  },
];

export const programTerms = [
  {
    label: "Leaving the program",
    text: "Either side can leave with **30 days' written notice**. Commission on referrals that signed before then is still paid, under the rules above.",
  },
  {
    label: "Removal",
    text: "We may remove a partner immediately for breaking the conduct rules. Unpaid commission on the affected referrals is forfeited.",
  },
  {
    label: "Changes to these terms",
    text: "We give 30 days' notice before any update. **Changes never reduce commission** on referrals already registered.",
  },
];

export const joinSteps = [
  { title: "Apply", text: "Fill in the partner application." },
  { title: "Sign", text: "Sign the partner agreement we send back." },
  {
    title: "Start referring",
    text: "Get your partner kit and register your first lead.",
  },
];

export const referralFaqHeading = "Partner questions";

export const referralFaq: FaqItem[] = [
  {
    q: "Do I need to help sell?",
    a: "No. A warm introduction is enough. We handle the pitch and the deal.",
  },
  {
    q: "Can I refer a company I've worked with?",
    a: "Yes, as long as it isn't already our client or in talks with us.",
  },
  {
    q: "What if the client signs a bigger project later?",
    a: "New work within 12 months of the first contract earns commission too.",
  },
  {
    q: "Is there a cap on earnings?",
    a: "No. Every qualified referral earns commission.",
  },
  {
    q: "Can I refer from outside India?",
    a: "Yes. We pay international partners by bank transfer, in the client's billing currency or your local currency.",
  },
  {
    q: "Does it cost anything to join?",
    a: "No. The program is free, with no targets and no exclusivity.",
  },
];

/** FAQPage structured data for the block above. Keep in sync with referralFaq. */
export const referralFaqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: referralFaq.map((item) => ({
    "@type": "Question",
    name: item.q,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.a,
    },
  })),
};

/** Options for the partner application. Values are stable keys for the
 * backend; labels are what the applicant sees. */
export const partnerTypeOptions = [
  { value: "growth", label: "Growth or marketing" },
  { value: "designer", label: "Designer or freelancer" },
  { value: "vc", label: "VC or accelerator" },
  { value: "other", label: "Other" },
] as const;

export const referralVolumeOptions = [
  { value: "1-2", label: "1–2" },
  { value: "3-5", label: "3–5" },
  { value: "6+", label: "6+" },
  { value: "unsure", label: "Not sure yet" },
] as const;

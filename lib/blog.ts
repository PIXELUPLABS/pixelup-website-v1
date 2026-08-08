/** One block of article body content — paste real copy in as a sequence of
    these, in reading order. Add a new variant here if a post needs a shape
    that doesn't fit yet (e.g. a quote or an image block). */
export type BlogContentBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface BlogPost {
  slug: string;
  title: string;
  /** SERP snippet. Emitted as <meta name="description"> and og:description by
      app/blog/[slug]/page.tsx, and as the BlogPosting `description` in the
      JSON-LD below. Written at ~150-160 characters, the length Google will
      show before truncating. (It also feeds the "Related Articles" card
      excerpt, currently commented out in BlogPostPage.) */
  description: string;
  categories: string[];
  image: string;
  author: string;
  publishedDate: string;
  updatedDate: string;
  content: BlogContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-design-agencies-for-ai-startups",
    title:
      "Best Design Agencies for AI Startups (2026): Who Designed Midjourney, Cursor, and Greptile",
    description:
      "Ten design agencies for AI startups compared on real 2026 prices, from basement.studio near $10k to MetaLab at $100k and up, plus where each one loses.",
    categories: ["Design"],
    image: "/media/blogs/blog-img-1.png",
    author: "Daksh, Founder at PIXELUP LABS",
    publishedDate: "2026-07-28",
    updatedDate: "2026-07-28",
    content: [
      {
        type: "paragraph",
        // Demo: **wrap text like this** in a paragraph to render it in white
        // instead of the paragraph's default grey — see renderHighlightedText
        // in components/blog/BlogPostPage.tsx.
        text: "MetaLab rebuilt Midjourney's interface, built Suno's brand, and built Windsurf's brand system, starting at $100k. basement.studio worked with Cursor, Harvey, Scale, and Replicate, starting near $10k. Lazarev has shipped 30+ AI products. Our sprints run $25–30k. Which one you want depends on whether the hard part is your product or your positioning. Ten studios below, with real prices and where each one loses.",
      },
      {
        type: "paragraph",
        text: "**Disclosure, up front:** we wrote this list and we put ourselves at number one. Read our entry with that in mind. Instead of pretending to be neutral: we publish our actual prices, name five things we are bad at, and hand five specific jobs on this page to studios that beat us at them.",
      },
      {
        type: "table",
        headers: ["The Job", "Who to Hire", "Price Signal"],
        rows: [
          [
            "Brand + site for AI-native B2B going enterprise, on a clock",
            "PIXELUP (us, and we wrote this list)",
            "$25–40k",
          ],
          [
            "An AI product used by millions, where the UX is the value",
            "MetaLab",
            "$100k min, $150–250k+",
          ],
          [
            "The craft your peer set already hired",
            "basement studio",
            "$10k+ min, $100–149/hr",
          ],
          [
            "Making a complex model legible in a demo",
            "Lazarev",
            "~$100/hr",
          ],
          [
            "A shipped agent or intelligent interface",
            "Punchcut",
            "Enterprise, project-based",
          ],
          [
            "A category claim at Series B+",
            "Character",
            "$80–250k",
          ],
          [
            "Cheapest credible sprint",
            "Parallel",
            "$12–30k",
          ],
          [
            "Content-heavy site at Series B+",
            "Webstacks",
            "Project-based",
          ],
          [
            "Pre-launch and seed on a tight budget",
            "Everything Design",
            "Early-stage packages",
          ],
        ],
      },
      { type: "heading", text: "Why designing for an AI company is a different job" },
      {
        type: "paragraph",
        text: "Your website has to sell something the buyer cannot see, to two audiences reading the same page.",
      },
      {
        type: "paragraph",
        text: "On one side, the engineer who will spot a hand-wavy claim in about four seconds and close the tab. On the other, the procurement lead and the VP who need to understand the value without reading a line of code, and who are mostly trying not to get fired.",
      },
      {
        type: "paragraph",
        text: "That translation is the entire job. It is also why a studio with a flawless B2B SaaS portfolio can faceplant on an AI product: nothing in a project-management-tool rebrand teaches you how to make a model feel trustworthy.",
      },
      {
        type: "paragraph",
        text: 'Here is the pattern we see. A founder comes to us eight months after a Series A. Their site says "harness the power of AI" above a gradient, which is what their four closest competitors also say. The product is genuinely better. Nobody can tell from the outside, so deals stall in the six silent minutes after the demo while a buyer looks them up.',
      },
      {
        type: "paragraph",
        text: "The test that filters most agencies: can they state your value in one sentence a buyer repeats to their boss, correctly, without you coaching them. Most cannot.",
      },
      { type: "heading", text: "How we picked, and how we scored ourselves" },
      { type: "paragraph", text: 'Five criteria, none of which is "nice portfolio."' },
      {
        type: "list",
        items: [
          "**Technical translation.** Can they turn a complex product into plain buyer language without making it wrong?",
          "**Dual-audience design.** Do developers and non-technical buyers both get served on the same page, or does one get sacrificed?",
          "**Enterprise trust signals.** Are security, SOC 2, and model transparency designed surfaces, or footer links?",
          "**Conversion architecture.** Demo and trial journeys, not brochures.",
          "**Shipping speed.** AI positioning has a short shelf life. Can they keep pace when yours moves?",
        ],
      },
      {
        type: "paragraph",
        text: "**How we know.** We have run 31 projects for funded B2B and AI-native startups, including Greptile, Sully, Bland, Reducto, and CTGT. We hold 5.0★ across every review we've received. And we publish our own prices on this site, which almost nobody in this category does.",
      },
      {
        type: "paragraph",
        text: '**On self-ranking, since we do it.** Every agency-authored list has a thumb on the scale, and you should know where each one puts itself. Parallel published its AI-startup list on 2 July 2026 and ranked itself #1. Punchcut publishes one titled "An Honest Comparison." We rank ourselves #1 here.',
      },
      {
        type: "paragraph",
        text: "So do not read the ordering as a neutral verdict. Read it as our pitch with the receipts attached. What you can actually check on this page is the prices, the limitations in every entry including ours, and the five jobs we hand to other studios in the box above.",
      },
      {
        type: "paragraph",
        text: "**Who this is for:** B2B AI companies from seed through Series C hiring a design partner. **Who it is not for:** consumer apps, teams shopping for the cheapest template, or companies that need a full in-house product-design department rather than a partner.",
      },
      {
        type: "paragraph",
        text: "Hiring specifically in the Bay Area? We keep a separate list of design agencies headquartered in San Francisco.",
      },
      { type: "heading", text: "The price map" },
      {
        type: "paragraph",
        text: "Every number is published or reported as of July 2026. Screenshot and re-date before quoting any of it; opaque pricing changes quietly.",
      },
      {
        type: "table",
        headers: ["Tier", "Who", "Range", "Timeline"],
        rows: [
          [
            "Elite product studio",
            "MetaLab",
            "$100k min, $150–250k+",
            "3–6 months"
          ],
          [
            "Prestige brand studio",
            "Character",
            "$80–250k",
            "10–24 weeks"
          ],
          [
            "Established studio",
            "Clay",
            "$50k+ min, $150–199/hr",
            "8–16 weeks"
          ],
          [
            "Boutique sprint",
            "PIXELUP",
            "$25–40k",
            "2–5 weeks"
          ],
          [
            "Craft boutique",
            "basement studio",
            "$10k+ min, $100–149/hr",
            "4–10 weeks"
          ],
          [
            "Early-stage sprint",
            "Parallel",
            "$12–30k, $6–15k/mo growth tier",
            "3–8 weeks"
          ],
          [
            "Productized subscription",
            "",
            "$699–$4,995/mo",
            "ongoing"
          ],
          [
            "Freelancer",
            "",
            "$2–8k",
            "variable"
          ],
          [
            "Template + Claude Code",
            "",
            "Free",
            "a weekend"
          ],
        ],
      },
      {
        type: "paragraph",
        text: "The honest read: the jump from $25k to $100k does not buy better taste. It buys seniority on your account, more research, and a bigger system. Whether you need those is a stage question, not a quality question.",
      },
      { type: "heading", text: "Quick comparison" },
      {
        type: "table",
        headers: ["Agency", "Best for", "Location", "Price Signal", "AI Receipt"],
        rows: [
          [
            "PIXELUP",
            "AI-native B2B going enterprise",
            "San Francisco + Bangalore studio",
            "$25–40k",
            "Greptile, Sully, Reducto"
          ],
          [
            "MetaLab",
            "Peer-set craft",
            "Buenos Aires + LA",
            "$10k+ min",
            "Cursor, Harvey, Scale, Baseten"
          ],
          [
            "Lazarev",
            "Model legibility",
            "San Francisco",
            "~$100/hr",
            "30+ AI products, Accern"
          ],
          [
            "Punchcut",
            "Shipped agents",
            "San Francisco",
            "Enterprise",
            "AI agents since 2002"
          ],
          [
            "Character",
            "Category claims",
            "San Francisco",
            "$80–250k",
            "Prestige tech brands"
          ],
          [
            "Clay",
            "Growth-stage brand + web",
            "San Francisco",
            "$50k+ min",
            "Coinbase, Uber"
          ],
          [
            "Parallel",
            "Cheapest credible sprint",
            "Remote (US/UK focus)",
            "$12–30k",
            "Early-stage AI practice"
          ],
          [
            "Webstacks",
            "Content-heavy sites",
            "San Diego",
            "Project-based",
            "Gong, Calendly, ServiceTitan"
          ],
          [
            "Everything Design",
            "Pre-launch and seed",
            "Bengaluru",
            "Early-stage packages",
            "Cloudphysician, Entropik"
          ],
        ],
      },
      { type: "heading", text: "The 10 agencies" },
      {
        type: "paragraph",
        text: "Our entry is first because we wrote the list. After that, grouped by lane.",
      },
      { type: "subheading", text: "PIXELUP LABS (us)" },
      {
        type: "paragraph",
        text: "**Price:** brand sprint $25–30k · brand + website $25–40k · retainer from $6k/mo · **Timeline:** 2-week brand sprints, 3-week sites · **Stack:** Framer, Webflow, custom when the product needs it",
      },
      {
        type: "paragraph",
        text: "We are the enterprise-readiness design partner for funded B2B startups, most of them AI-native. We rebuild brand, website, and product design around the opinion a founder holds about their market, so enterprise buyers stop hesitating before they ever book the demo. San Francisco, with our production studio in Bangalore.",
      },
      {
        type: "paragraph",
        text: "Our thesis is proof over promise. 'Backed by YC' and 'harness the power of AI' are not differentiators when every competitor on the shortlist says the same words. Clients include Greptile (2025 rebrand and design system), Sully, Reducto, Sainapse, Bland, and CTGT, all companies whose value had to be made legible to an engineer and a procurement lead on the same page.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** brand and website as one engagement, one team, in two to five weeks, with the design system left behind so it does not decay eight months later. On Greptile's 2025 engagement that meant 200+ components and dev-first documentation.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:**",
      },
      {
        type: "list",
        items: [
          "**We are not a committee studio.** We work founder-to-founder. If your rebrand needs a steering committee and a stakeholder matrix, hire a Character-tier firm and budget three to five times our number.",
          "**We are not a pair of hands.** We take a position on messaging and positioning. If your strategy is locked and the Figma is done, a freelancer at $2–8k is cheaper and faster.",
          "**We are not a product-design department.** We do product design inside a brand engagement. If you need a team embedded in your sprint cadence for a year, that is a different hire.",
          "**Our team works from Bangalore, on Pacific overlap.** If procurement requires an on-site or US-domiciled delivery team, apply that filter early.",
          "**$25–30k is real money at seed.** Under $2M raised, we are the wrong line item and a template is the honest answer.",
        ],
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire us for AI-native B2B going enterprise on a Series A budget and a deadline. For a product used by millions, MetaLab. For the craft your peer set hired, basement. For a shipped agent, Punchcut. For a cheaper sprint, Parallel.",
      },
      { type: "subheading", text: "MetaLab" },
      {
        type: "paragraph",
        text: "**Price:** $100k minimum, regularly $150–250k+, ~$150–199/hr · **Location:** Victoria BC, distributed",
      },
      {
        type: "paragraph",
        text: "MetaLab designed the original Slack interface, and that product-first DNA runs straight through their AI work. They moved Midjourney off Discord into its own web interface, built Suno's brand and the interface behind it, and built Windsurf's brand system across marketing site and product. Other clients include Coinbase, Oculus, Robinhood, Uber, and Google.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** AI products where the interface is the value and it will be used by very large numbers of people. Nobody on this list has done that more times.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** the $100k floor and multi-month timelines are a hard filter. If you are pre-Series B with finite runway and a conference in eight weeks, this is the wrong shape of engagement, and no amount of wanting it changes that.",
      },{
        type: "paragraph",
        text: "**Verdict:** the best product studio here, full stop, if you can afford the floor. They beat us on product depth and on scale experience by a wide margin.",
      },
      { type: "subheading", text: "basement Studio" },
      {
        type: "paragraph",
        text: "**Price:** $10k+ minimum, $100–149/hr · **Location:** Buenos Aires and LA, 35 people The most striking client roster in this category: Cursor, Scale, Harvey, Baseten, Black Forest Labs, Replicate, Linear, and Vercel. If you are an AI infra or devtools founder, this is the studio your peer set already hired. Webby and Awwwards recognition, and a reputation on design Twitter that they earned through the work rather than through marketing.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** modern tech craft, immersive web, and the specific visual language that reads as credible to a developer audience. The price-to-craft ratio is the best on this page.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** they are a craft and web studio more than a positioning shop. If you arrive without a clear point of view about your market, you will get a beautiful expression of an unclear idea. Also 35 people in Argentina means timezone math for a US West Coast team.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** if your positioning is settled and you want the aesthetic your competitors' engineers respect, hire basement. They beat us on pure craft and on peer-set signaling.",
      },
      { type: "subheading", text: "Lazarev" },
      {
        type: "paragraph",
        text: "**Price:** ~$100/hr · **Location:** San Francisco, founded 2015 by Kyrylo Lazariev, 50+ team Designing AI products since 2017, with 30+ shipped across copilots, decision engines, and data-heavy platforms. Three consecutive years of Webby recognition for AI products, including Best Visual Design for AI at the 30th Annual Webby Awards. Their Accern work built AI research tooling for analysts and VCs. Their stated principle is blunt and correct: if design is not moving adoption or revenue, it is decoration.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** the hardest problem in this category, which is making intelligence feel simple and trustworthy inside a demo, a POC, or a QBR. They are also the most visible studio in the category across organic and AI search, which tells you something about how they think about distribution.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** they lean product and UX over marketing brand. A pure positioning-and-identity engagement is not the center of their practice.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** strong when the product and the website have to tell one coherent story about a complex model.",
      },
      { type: "subheading", text: "Punchcut" },
      {
        type: "paragraph",
        text: "**Price:** enterprise, project-based · **Location:** San Francisco, founded 2002 Two decades at the frontier of human-machine interaction: voice interfaces, AI agents, automotive systems, and multimodal experiences for Google, Amazon, Ford, Samsung, LG, Salesforce, and Johnson & Johnson. Their Design Accelerator model ships production-ready products in 6 to 12 weeks by pairing senior teams with proven interaction patterns and build-to-learn prototyping.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** when the deliverable is an intelligent product, an agent, or an interface that has to actually ship, and the patterns matter more than the paint.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** a focused product studio, not a marketing shop. If you need a brand and a website, you are paying enterprise rates for the wrong specialty.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire Punchcut over us without hesitation if the job is the agent itself rather than how the company is perceived before the demo.",
      },
      { type: "subheading", text: "Character" },
      {
        type: "paragraph",
        text: "**Price:** $80–250k · **Location:** San Francisco One of the most recognized brand studios in tech, known for identities that read expensive without reading corporate. Research-first: competitive analysis, customer research, and market positioning all land before any visual work, so the identity rests on strategy rather than taste.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** Series B and up, when the brand has to carry a category claim and the budget can absorb a real research phase.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** the floor is $80k and the timeline is 10 to 24 weeks. There is no seed-stage version of Character.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire Character if you have raised a large B and the brand is the bet. They beat us on research depth and visual authority.",
      },
      { type: "subheading", text: "Clay" },
      {
        type: "paragraph",
        text: "**Price:** $50k+ minimum, $150–199/hr, projects reported $10–150k (Clutch) · **Location:** San Francisco HQ Among the most respected studios in the design community. The work balances brand perception against conversion, so the site looks crafted and still makes people act. Clients include Coinbase, Uber, Amazon, VMware, Cisco, and ADP, plus offices across NY, Austin, Denver, Lisbon, and Belgrade.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** growth-stage applied AI with a healthy budget, wanting a site that signals category leadership.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** the $50k minimum rules out pre-Series A, and the enterprise client mix means a 25-person startup is a small account.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire Clay when the product is real, the budget is there, and the site needs to look like the market leader's.",
      },
      { type: "subheading", text: "Parallel" },
      {
        type: "paragraph",
        text: "**Price:** design sprints $12–30k (seed engagements typically $14–20k), growth retainer $6–15k/mo · **Location:** remote, US and UK focus A design partner built specifically for early-stage AI and B2B SaaS, integrating product strategy, opportunity mapping, and onboarding design into one engagement so strategy and design decisions stay in the same room. They publish more content on this exact query set than anyone, which is how you probably found this page in the first place.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** seed and early Series A budgets that still want strategy in the room, and product-led companies where onboarding is the conversion surface.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** the sprint tier is genuinely cheaper than ours, and cheaper buys less: less brand depth, and a practice weighted toward product over the perception problem that stalls enterprise deals. They also rank themselves #1 on their own comparable list, so calibrate their rankings the same way you calibrate ours.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** the honest cheaper alternative to us. If $25k is out of reach and you need strategy anyway, start here.",
      },
      { type: "subheading", text: "Webstacks" },
      {
        type: "paragraph",
        text: "**Price:** project-based · **Location:** San Diego, remote-first They treat the website as a product: modular, documentation-driven, and built to scale. Strong on composable and headless architecture as well as Webflow, and specialized in sites juggling multiple product lines, enterprise and SMB audiences side by side, and heavy content. Clients include Gong, Calendly, and ServiceTitan.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** Series B and up with a real in-house marketing team and a site that has outgrown a simple builder.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** heavier than an early-stage team needs, and the engagement assumes you have marketers to feed it. This is not the partner for a first brand.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** the right call once your site is a content operation rather than a set of pages.",
      },
      { type: "subheading", text: "Everything Design" },
      {
        type: "paragraph",
        text: "**Price:** early-stage brand and website packages, 8 to 10 week timeline · **Location:** Bengaluru An explicit AI-startup practice, with a philosophy that matches the argument of this article: use-case specificity over 'AI-powered,' proof over claims. They have built for clinical AI (Cloudphysician), consumer-insights AI (Entropik), contract AI (SimpliContract), and Peoplebox. In-house motion means the team writing the messaging also visualizes the AI workflow.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** pre-launch and seed companies with a finite budget that still need the product made legible.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** they do not publish pricing, so you cannot self-qualify before a call. And early-stage packages mean early-stage scope: this is not the team for an enterprise-motion repositioning.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** the value pick at the earliest end, and a genuine alternative to us for founders who cannot reach $25k.",
      },
      { type: "heading", text: "When you should not hire an agency at all" },
      {
        type: "paragraph",
        text: "The honest answer for a real share of the people reading this. **If you are pre-PMF**, don't. Use a template and Claude Code. A brand amplifies a position, and if the position is still moving you are paying to personify something that will change. Come back after the pivot settles.",
      },
      {
        type: "paragraph",
        text: "**If cost is your only reason for switching,** a subscription at $699 to $4,995/mo buys production without strategy, and that is the right trade for some teams.",
      },
      {
        type: "paragraph",
        text: "**If you have a locked Figma and fixed comps,** hire a freelancer at $2–8k. You do not need anyone's opinion and should not pay for one.",
      },
      {
        type: "paragraph",
        text: "**If your problem is pipeline volume,** hire a growth agency. Design makes every impression land harder. It does not create impressions.",
      },
      { type: "heading", text: "Red flags, fast filter" },
      {
        type: "list",
        items: [
          "A portfolio of AI sites where every hero is a variant of 'harness the power of AI' and none say what the product does.",
          "No technical-product clients, which means they have never had to make an engineer trust a claim.",
          "Twelve weeks quoted for a fifteen-page marketing site. Slow, over-scoped, or both.",
          "No opinion on your messaging. An agency that nods along to whatever you say is a pair of hands, not a partner.",
          "Security and compliance treated as footer links. Enterprise AI buyers go straight there.",
          "An agency-authored list that ranks itself first without saying so, never publishes a price, and never names a job it loses. We rank ourselves first here. The other three are the tell.",
        ],
      },
      { type: "heading", text: "FAQ" },
      { type: "subheading", text: "How much does a website cost for a B2B AI company?" },
      {
        type: "paragraph",
        text: "Expect $10–25k for an early-stage brand and site, $25–75k for a growth-stage redesign, and $100–250k+ at elite product studios like MetaLab. Framer and Webflow builds tend to land $15–40k. Productized subscriptions run $699–$4,995/mo. Price scales with strategy depth, team seniority, and how much system you keep, more than with page count.",
      },
      { type: "subheading", text: "Do we need an AI-specialized agency, or is a generic B2B agency fine?" },
      {
        type: "paragraph",
        text: "You need one that has made a complex, invisible product legible before, whether or not they label themselves AI. The failure mode of a generic B2B agency is a site that looks fine and explains nothing, because nothing in a standard SaaS rebrand teaches you to earn an engineer's trust. Judge by the work, not the label.",
      },
      { type: "subheading", text: "Every AI startup website looks the same now. Does it matter?" },
      {
        type: "paragraph",
        text: "It matters at exactly one moment: when an enterprise buyer is comparing you to three alternatives after a demo. Sameness is free when you are the only option and expensive when you are one of four. If a buyer swapped your logo onto a competitor's site and nobody noticed, your design is doing no work in that comparison.",
      },
      { type: "subheading", text: "Our website looks like every other AI startup. How do we stand out?" },
      {
        type: "paragraph",
        text: "Start from the opinion you hold about your market that your competitors would not say out loud, then build the brand to argue it. Most AI startup sites are interchangeable because they describe a category instead of taking a position. The fix is not a new gradient, it is deciding what you are against.",
      },
      { type: "subheading", text: "How do I make my startup look more credible to enterprise buyers?" },
      {
        type: "paragraph",
        text: "Specificity and coherence. Named customers, real numbers, a claim narrow enough to be falsifiable, and a designed security and compliance surface rather than footer links. Enterprise buyers are not judging whether your product is good, they are judging whether you will exist in three years, and coherence across site, deck, and product is most of the evidence they have before a call.",
      },
      { type: "subheading", text: "Webflow, Framer, or custom code for an AI startup site?" },
      {
        type: "paragraph",
        text: "For most seed to Series B AI companies, Framer or Webflow: fast to build, and marketing can update it without a developer. Go custom when the site needs real app logic, gated product experiences, or scale a builder cannot handle. The wrong reason to go custom is that it sounds more serious.",
      },
      { type: "subheading", text: "How long should an AI company website take?" },
      {
        type: "paragraph",
        text: "A focused Framer or Webflow marketing site is 2 to 6 weeks from approved design. A full brand plus site is 8 to 10 weeks at most studios, and our sprints run two weeks for brand and three for the site. Elite product studios run 3 to 6 months. Speed is strategic here: AI positioning has a short shelf life, so shipping late means shipping something already stale.",
      },
      { type: "subheading", text: "Should branding and website be done together?" },
      {
        type: "paragraph",
        text: "For early-stage AI companies, usually yes. The brand and the site are the same first impression, and splitting them across vendors tends to produce a site whose message and visuals disagree. A combined engagement keeps the story coherent and skips a handoff that costs weeks.",
      },
      { type: "subheading", text: "Who designed Midjourney's interface, and who designed Cursor's site?" },
      {
        type: "paragraph",
        text: "MetaLab moved Midjourney off Discord into its own web interface, and also built Suno's brand and interface and Windsurf's brand system. basement.studio has worked with Cursor, along with Scale, Harvey, Baseten, Black Forest Labs, and Replicate. Those two studios account for a striking share of the AI products whose design people actually talk about.",
      },
      { type: "subheading", text: "When should a startup hire a design agency vs a freelancer?" },
      {
        type: "paragraph",
        text: "Hire a freelancer when the strategy is locked, the scope is defined, and you need execution at $2–8k. Hire an agency when someone needs to take a position on what the brand should argue, when the work spans brand and site and product, or when you need a system maintained after launch. If you are still deciding what to say, a freelancer will build exactly what you asked for and it will be wrong.",
      },
      { type: "subheading", text: "How much should a funded startup invest in brand?" },
      {
        type: "paragraph",
        text: "At Series A going upmarket, budget $25–60k and four to six weeks for brand plus website. Below $2M raised, spend near zero on agencies. At Series B with a category claim to defend, $80k+ at a prestige studio is defensible. The filter is not what you can afford, it is whether your positioning is settled enough to be worth amplifying.",
      },
      { type: "subheading", text: "We built our site with Claude Code. Is that hurting us with enterprise buyers?" },
      {
        type: "paragraph",
        text: "Only if it looks like it, and it usually does. The tell is not that it was AI-built, it is that it is generic: the same hero, the same three-column grid, the same gradient as the other companies in your category, because you all prompted the same model. That reads as early-stage to a buyer trying to assess whether you will still exist at renewal.",
      },
      { type: "subheading", text: "The bottom line" },
      {
        type: "paragraph",
        text: "The right partner for an AI startup is not the one with the flashiest portfolio, and it is not automatically the one at the top of a list that studio wrote itself. Ours is at the top of ours. Discount that accordingly and use the criteria instead: can they make your model obvious to a buyer in five seconds and defensible to an engineer in the next five.",
      },
      {
        type: "paragraph",
        text: "If you are a funded B2B or AI-native company that needs brand and website shipped by one team in weeks, that is our lane, and our prices are above so you can disqualify us in thirty seconds. If a studio on this list fits your job better, hire them.",
      },
      {
        type: "paragraph",
        text: "Prices verified July 2026 from published pricing pages and Clutch profiles. Opaque pricing moves quietly, so re-check before quoting any of it.",
      },
    ],
  },
  {
    slug: "best-design-agencies-in-san-francisco",
    title: "Best Design Agencies in San Francisco (2026): 10 Compared, With Real Prices",
    description:
      "Ten San Francisco design agencies compared, all genuinely headquartered there, with real 2026 prices from $10k to $500k and why the same brief varies 25x.",
    categories: ["Design"],
    image: "/media/blogs/blog-img-2.png",
    author: "Daksh, Founder at PIXELUP LABS",
    publishedDate: "2026-07-28",
    updatedDate: "2026-07-28",
    content: [
      {
        type: "paragraph",
        text: "San Francisco design agencies charge between roughly $10,000 and $500,000 for what founders describe as the same brief. Character runs $80–250k. Clay starts at $50k. Ramotion does brand identity at $30–150k. Our sprints run $25–30k. The 25x spread is not craft. It's strategy depth, team seniority, and how much system you keep after they leave.",
      },
      {
        type: "paragraph",
        text: "**Every studio below is headquartered in San Francisco.** That sounds like a low bar for a page titled this way. It isn't. The list currently ranking for this query includes studios in Ukraine, London, and Georgia. We cut every agency we could not place in SF, including several we rate highly, because a city in the title should mean something.",
      },
      {
        type: "paragraph",
        text: "**Disclosure, up front:** we wrote this list and we put ourselves at number one. Read our entry with that in mind. Instead of pretending to be neutral: we publish our actual prices, we name five things we are bad at, and we hand seven of the eight jobs in the box below to competitors who beat us at them.",
      },
      {
        // TODO: real row data for this comparison table lands later.
        type: "table",
        headers: ["The Job", "Who to Hire", "Price Signal"],
        rows: [
           [
            "Best for AI-native B2B going enterprise on a Series A budget",
            "PIXELUP (us, and we wrote this list)",
            "$25–40k",
          ],
          [
            "Best overall for enterprise-tier brand",
            "Character",
            "$80–250k",
          ],
          [
            "Best brand system across product, deck, and site",
            "Ramotion",
            "$30–150k",
          ],
          [
            "Best for a digital product at real scale",
            "Fantasy",
            "Enterprise, project-based",
          ],
          [
            "Best when the deliverable is a shipped AI product",
            "Punchcut",
            "Enterprise, project-based",
          ],
          [
            "Best for making a complex model feel obvious",
            "Lazarev",
            "~$100/hr",
          ],
          [
            "Best small senior brand studio",
            "Moniker",
            "$40–150k (reported)",
          ],
          [
            "Best for a fundraise-facing narrative",
            "Wunderdogs",
            "Project-based",
          ],
        ],
      },
      {
        type: "paragraph",
        text: "If you are pre-PMF, hire nobody on this list. Use a template and Claude Code, and come back after the pivot settles.",
      },
      { type: "heading", text: "Why the portfolio is the wrong place to start" },
      {
        type: "paragraph",
        text: "Every agency on this page has a portfolio that looks incredible. That is what a portfolio is for. It is a filtered set of the best work, shot at the best angle, for the clients who said yes to the best ideas.",
      },
      {
        type: "paragraph",
        text: "So the portfolio tells you almost nothing about whether the studio can do your job.",
      },
      {
        type: "paragraph",
        text: "Here is the pattern we see over and over. A founder comes to us eight months after a Series A, having already hired someone whose Dribbble was flawless, and the brand fell apart the first time their engineer needed a component that wasn't in the file. The taste was real. The system wasn't there.",
      },
      {
        type: "paragraph",
        text: 'The useful question is not "who is the best design agency in San Francisco." It\'s "which lane do I need, at my stage, and who is honest about where they lose."',
      },
      { type: "heading", text: "Which lane do you actually need?" },
      {
        type: "paragraph",
        text: "The SF search results blur brand, web, and product together. That's why founders hire the wrong specialist and blame the specialist.",
      },
      {
        type: "paragraph",
        text: "**Brand** is the identity system: positioning, naming, logo, voice, and the guidelines that hold it together. Hire this when the story itself is unclear, or when you are rebranding.",
      },
      {
        type: "paragraph",
        text: "**Web** is the site that expresses the brand: marketing pages, conversion paths, the CMS your team edits without a developer. Hire this when the identity is solid but the site reads a generation behind.",
      },
      {
        type: "paragraph",
        text: "**Product-UX** is the app: flows, the UI system, the in-product experience. Hire this when users understand your pitch and then churn once they're inside.",
      },
      {
        type: "paragraph",
        text: "Rule of thumb. Launching or rebranding, go brand-first. Identity fine, site weak, go web. Users churning in-app, go product-UX. And if you are early-stage, one partner doing brand and web together almost always beats two vendors and a handoff, because the handoff is where the story goes quiet.",
      },
      { type: "heading", text: "How we picked, and how we scored ourselves" },
      { type: "paragraph", text: "Two filters, then five criteria." },
      {
        type: "paragraph",
        text: '**Filter one: headquartered in San Francisco.** Not "serves SF." Not "Bay Area." Not "has a client in SF." A studio\'s own stated headquarters. This cut four agencies we would otherwise recommend, listed at the bottom.',
      },
      {
        type: "paragraph",
        text: "**Filter two: not a network shop.** Landor and frog both have real SF headquarters and both are owned by holding companies (frog by Capgemini). Their economics, timelines, and minimums put them in a different category from everything here, so they are out.",
      },
      {
        type: "paragraph",
        text: 'Then five criteria, and "nice portfolio" is not one of them.',
      },
      {
        type: "list",
        items: [
          "**Outcomes over awards.** Does the case study show business impact, or a screenshot? A trophy proves taste. A metric proves impact.",
          "**System thinking.** Does the work survive contact with a real product UI, a deck, and a live site, or is it a one-off artifact?",
          "**Stage fluency.** An MVP scope and an enterprise rebrand are different jobs. Studios fluent in one drown in the other.",
          "**Process transparency.** Who actually works on your account, partners or juniors, and how fast do they move?",
          "**Post-handoff usability.** Do you get a system your team can run, or a beautiful dependency?",
        ],
      },
      {
        type: "paragraph",
        text: "**How we know.** We have run 31 projects for funded B2B and AI-native startups, including Greptile, Sully, Bland, Reducto, and CTGT. We hold 5.0★ across every review we've received. And we publish our own prices on this site, which almost nobody in this category does.",
      },
      {
        type: "paragraph",
        text: "**On self-ranking, since we do it.** Every agency-authored list has a thumb on the scale, and you should know where each one puts itself. dp.vision ranks itself #8 of 15 on the SF list currently ranking for this query (Updated June 2026). Parallel published an AI-startup list on 2 July 2026 and ranked itself #1. We rank ourselves #1 here.",
      },
      {
        type: "paragraph",
        text: "So do not take the ordering as a neutral verdict, take it as our pitch with the receipts attached. The parts of this page you can actually check are the prices, the limitations in each entry, the SF filter, and the seven jobs we hand to other studios in the box above. Those are the parts we would be embarrassed to get wrong.",
      },
      {
        type: "paragraph",
        text: "**Who this is for:** founders and marketing leads at funded startups through scale-ups hiring a design partner. **Who it is not for:** teams wanting the cheapest template, or enterprises needing a global network shop.",
      },
      {
        type: "paragraph",
        text: "If you are specifically an AI-native B2B company and geography is not your filter, we keep a separate list scoped to that: best design agencies for AI startups.",
      },
      { type: "heading", text: "The San Francisco price map" },
      {
        type: "paragraph",
        text: "Where every SF tier actually sits, plus the three ways to buy design that aren't an agency at all. Every number is a published or reported range as of July 2026. Screenshot and re-date these before quoting them anywhere; opaque pricing changes quietly.",
      },
      {
        // TODO: real row data for this pricing-tier table lands later.
        type: "table",
        headers: ["Tier", "Who", "Range", "Timeline"],
        rows: [
          [
            "Network / holding-company",
            "Landor (SF), frog (SF, Capgemini-owned)",
            "$100k–$500k+",
            "12–24 weeks"
          ],
          [
            "Prestige studio",
            "Character",
            "$80–250k",
            "10–24 weeks"
          ],
          [
            "Established studio",
            "Tolleson, Clay, Ramotion",
            "$30–200k",
            "8–16 weeks"
          ],
          [
            "Senior boutique",
            "Moniker",
            "$40–150k",
            "6–12 weeks"
          ],
          [
            "Boutique sprint",
            "PIXELUP",
            "$25–40k",
            "2–5 weeks"
          ],
          [
            "Productized subscription",
            "not SF-specific",
            "$699–$4,995/mo",
            "ongoing"
          ],
          [
            "Freelancer",
            "",
            "$2–8k",
            "variable"
          ],
          [
            "Template + Claude Code",
            "",
            "Free",
            "a weekend"
          ],
        ],
      },
      {
        type: "paragraph",
        text: "The honest read on this table: the biggest jump in price does not buy you better taste. It buys seniority on your account, deeper strategy, and a bigger system. Whether you need those three things is a stage question, not a quality question.",
      },
      { type: "heading", text: "Quick comparison" },
      {
        // TODO: real row data for this quick-comparison table lands later.
        type: "table",
        headers: ["Studio", "Lane", "Price Signal", "Best for"],
        rows: [
          [
            "PIXELUP",
            "Brand + web",
            "$25–40k",
            "AI-native B2B going enterprise, Series A budget"
          ],
          [
            "Character",
            "Brand",
            "$80–250k",
            "Series B+ identity with real budget"
          ],
          [
            "Clay",
            "Brand + web",
            "$50k+ min, $150–199/hr",
            "Scale-stage site that signals category leadership"
          ],
          [
            "Ramotion",
            "Brand + Product",
            "$30–150k",
            "Brand systems across product, deck, and site"
          ],
          [
            "Fantasy",
            "Product/AI",
            "Enterprise, project-based",
            "Digital products used by millions"
          ],
          [
            "Punchcut",
            "Product / UX",
            "Enterprise, project-based",
            "Shipping an intelligent product or agent"
          ],
          [
            "Lazarev",
            "Product-UX + web",
            "~$100/hr",
            "Making a complex model feel obvious"
          ],
          [
            "Moniker",
            "Brand",
            "$40–150k (reported)",
            "Small senior team, no account-management layer"
          ],
          [
            "Tolleson",
            "Brand",
            "$60–200k (reported)",
            "Refined, timeless identity work"
          ],
          [
            "Wunderdogs",
            "Brand + narrative",
            "Project-based",
            "Brand built to land with investors"
          ],
        ],
      },
      {
        type: "paragraph",
        text: 'Prices marked "reported" are third-party estimates, not published by the studio. Treat them as a signal, not a quote.',
      },
      { type: "heading", text: "The ten agencies" },
      {
        type: "paragraph",
        text: "Our entry is first because we wrote the list. After that, grouped by lane.",
      },
      { type: "subheading", text: "PIXELUP LABS (us)" },
      {
        type: "paragraph",
        text: "**Lane:** brand and web under one roof · **Price:** brand sprint $25–30k · brand + website $25–40k · retainer from $6k/mo",
      },
      {
        type: "paragraph",
        text: "We are the enterprise-readiness design partner for funded B2B startups, most of them AI-native. We rebuild brand, website, and product design around the opinion a founder holds about their market, so enterprise buyers stop hesitating before they ever book the demo. San Francisco, with our production studio in Bangalore. Clients include Greptile (2025 rebrand and design system), Sully, Reducto, Sainapse, Bland, and CTGT.",
      },
      {
        type: "paragraph",
        text: "The specific thing we do that most of this list does not: brand and website as one engagement, one team, in two to five weeks, and we leave the design system behind so it doesn't decay eight months later. On Greptile's 2025 engagement that meant 200+ components and dev-first documentation.",
      },
      { type: "paragraph", text: "**Where it doesn't:**" },
      {
        type: "list",
        items: [
          "**We are not a committee studio.** We work founder-to-founder. If your rebrand needs a steering committee and a stakeholder matrix, we are the wrong shape and you should hire a Character- or Landor-tier firm that runs that process properly. Budget three to five times our number for it.",
          "**We are not a pair of hands.** We take a position on messaging and positioning. If your strategy is locked and the Figma is done, a freelancer at $2–8k is cheaper and faster.",
          "**We are not a growth agency.** We fix how you are perceived. We will not drive your MQLs.",
          "**Our team works from Bangalore, on Pacific overlap.** If your procurement requires an on-site or US-domiciled delivery team, apply that filter early rather than discovering it in week two.",
          "**$25–30k is real money at seed.** If you have raised under $2M, we are the wrong line item, and a template is the honest answer.",
        ],
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire us for AI-native B2B going enterprise on a Series A budget and a clock. For enterprise-tier research depth, Character. For multi-surface brand systems, Ramotion. For the AI product itself, Punchcut.",
      },
      { type: "subheading", text: "Character" },
      { type: "paragraph", text: "**Lane:** brand · **Price:** $80–250k" },
      {
        type: "paragraph",
        text: "One of SF's most recognized brand studios, known for identities that read expensive without reading corporate, and for building brands that later became household names. The process is research-first: competitive analysis, customer research, and market positioning land before any visual work, so the logo and color system rest on strategy rather than taste.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** Series B and up, when the brand has to carry a category claim and the budget can absorb a real research phase.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** the floor is $80k. There is no version of Character that fits a seed or bootstrapped budget, and a 10 to 24 week timeline does not fit a conference deadline eight weeks out.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire Character if you have raised a large B and the brand is the bet. They beat us on depth of research and on sheer visual authority.",
      },
      { type: "subheading", text: "Clay" },
      {
        type: "paragraph",
        text: "**Lane:** brand and web · **Price:** $50k+ minimum, $150–199/hr, projects reported $10–150k (Clutch)",
      },
      {
        type: "paragraph",
        text: "Among the most respected studios in the design community. The work balances brand perception against conversion, so the site looks crafted and still makes people act. SF headquarters with offices in New York, Austin, Denver, Lisbon, and Belgrade. Clients include Coinbase, Uber, Amazon, VMware, Cisco, and ADP.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** growth and scale-stage tech with a healthy budget, wanting a site that signals category leadership.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** the $50k minimum puts it out of reach pre-Series A, and the enterprise client mix means a 25-person startup is a small account.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire Clay when your product is real, the budget is there, and the site needs to look like the market leader's.",
      },
      { type: "subheading", text: "Ramotion" },
      {
        type: "paragraph",
        text: "**Lane:** brand plus product · **Price:** brand identity $30–150k, logo and visual identity alone $10–50k",
      },
      {
        type: "paragraph",
        text: "Founded 2009 in SF, so roughly 17 years translating brand strategy through both marketing and product surfaces. Clients include Oracle, Salesforce, Netflix, Adobe, Okta, Xero, Mozilla, and Descript, which is the technical SaaS credibility that matters on complex work. They start with discovery, positioning, and brand architecture before touching a logo, and they build brands as scalable design systems rather than static PDF guidelines. 4.9 average on Clutch and DesignRush.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** Series B and up needing one brand system that holds across the product UI, the sales deck, and the site.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** the investment and timeline are calibrated for that stage, not for seed. If you need a marketing site in three weeks, this is the wrong shape of engagement.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** the strongest pick on this list for multi-surface brand systems. They beat us when the product UI is as much of the brand as the website is.",
      },
      { type: "subheading", text: "Fantasy" },
      { type: "paragraph", text: "**Lane:** digital product design · **Price:** enterprise, project-based" },
      {
        type: "paragraph",
        text: "Studios in San Francisco and New York, roughly 250 people, and 25+ years of work on products used by enormous numbers of people: Nike, Disney, Microsoft, Netflix, Spotify, Ford, Google, and 23andMe. They describe themselves as the creative partner to 80% of Forbes' Top 10, and they have stayed independent with no holding-company overhead. Recent positioning leans AI-native digital product design.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** consumer-scale or enterprise-scale digital products where the interface is the business, and you need senior people who have shipped at that scale before.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** at 250 people this is not a boutique, and the engagements are sized accordingly. A Series A startup wanting a brand and a marketing site is not the account this studio is built around.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** the most serious product-design shop on this list. If your product is going to be used by millions, they have done it more times than anyone else here.",
      },
      { type: "subheading", text: "Punchcut" },
      {
        type: "paragraph",
        text: "**Lane:** product and UX for emerging technology · **Price:** enterprise, project-based",
      },
      {
        type: "paragraph",
        text: "Designing at the frontier of emerging tech from SF since 2002: voice interfaces, AI agents, automotive systems, and multimodal experiences for Fortune 500 clients including Google, Amazon, Ford, Samsung, LG, Salesforce, and Johnson & Johnson. Their Design Accelerator model ships production-ready products in 6 to 12 weeks by pairing senior teams with proven interaction patterns and build-to-learn prototyping.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** when the deliverable is an intelligent product, agent, or interface that has to actually ship.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** this is a focused product studio, not a marketing shop. If what you need is a brand and a website, you are paying enterprise rates for the wrong specialty.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire Punchcut over us without hesitation if the job is the AI product itself rather than how the company is perceived before the demo.",
      },
      { type: "subheading", text: "Lazarev" },
      { type: "paragraph", text: "**Lane:** product-UX and web for AI-native teams · **Price:** ~$100/hr" },
      {
        type: "paragraph",
        text: "Headquartered on Mason Street in San Francisco, founded 2015 by Kyrylo Lazariev, with a team of 50+ strategists, designers, and analysts and Ukrainian roots. Designing AI products since 2017, with 30+ shipped across copilots, decision engines, and data-heavy platforms. Three consecutive years of Webby recognition for AI products, including Best Visual Design for AI at the 30th Annual Webby Awards. Their Accern work built AI research tooling for analysts and VCs. Their operating principle is blunt and correct: if design is not moving adoption or revenue, it is decoration.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** the hardest part of AI design, which is making intelligence feel simple and trustworthy in a demo, a POC, or a QBR. They are also the most visible studio in this category in both organic and AI search, which tells you something about how they think about distribution.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** they lean product and UX over marketing brand, so a pure positioning-and-identity job is not the center of their practice.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** strong when your product and your website have to tell one coherent story about a complex model.",
      },
      { type: "subheading", text: "Moniker" },
      { type: "paragraph", text: "**Lane:** brand · **Price:** $40–150k (reported, not published)" },
      {
        type: "paragraph",
        text: "An SF design and branding studio led by Brent Couchman, ten years in, combining design, language, and strategy. Their own pitch is the absence of overhead: a small senior team without the layers of management that get in the way of the work, which in practice means the people you meet are the people who do it.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** naming and verbal identity alongside visual work, and buyers who specifically do not want an account manager between them and the designers.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** a small senior team is a capacity constraint. If you need brand, site, product UI, and a deck delivered in parallel on a hard date, a larger shop absorbs that better.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** the closest studio on this list to how we work, at a higher price point and with deeper verbal-identity chops.",
      },
      { type: "subheading", text: "Tolleson" },
      { type: "paragraph", text: "**Lane:** brand · **Price:** $60–200k (reported, not published)" },
      {
        type: "paragraph",
        text: "A veteran San Francisco studio with decades of work behind it. The output is refined and deliberately timeless, and they do not chase trends, which is either exactly what you want or exactly what you don't depending on your market.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** companies that need to read as established and permanent rather than new and fast. Restraint is the product.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** if your positioning depends on looking like the aggressive challenger to a legacy incumbent, a studio built on restraint is working against your brief.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire Tolleson when the goal is gravity rather than momentum.",
      },
      { type: "subheading", text: "Wunderdogs" },
      {
        type: "paragraph",
        text: "**Lane:** brand and narrative for fundraising-stage startups · **Price:** project-based and retainer, not published",
      },
      {
        type: "paragraph",
        text: "Founded 2017 in SF by Daria González and Olga Svitelska, former venture capitalists rather than agency veterans, which is the whole point: they know what investors actually look at. 170+ startups and 30+ VC firms since then, across the US, UK, and Canada. They report clients raising over $173 million on the back of their pitch-deck work.",
      },
      {
        type: "paragraph",
        text: "**Where it shines:** a founder-led company preparing to raise, where the brand has to convince customers and investors in the same week.",
      },
      {
        type: "paragraph",
        text: "**Where it doesn't:** the fundraise lens is a specialty, not a universal. If your problem is that enterprise procurement stalls your deals, an investor-tuned narrative solves the wrong half.",
      },
      {
        type: "paragraph",
        text: "**Verdict:** hire Wunderdogs if the next milestone is a round. Hire us if the next milestone is a Fortune 500 signature.",
      },
      { type: "heading", text: "When you should not hire an agency at all" },
      {
        type: "paragraph",
        text: "The honest answer for a real share of the people reading this.",
      },
      {
        type: "paragraph",
        text: "**If you are pre-PMF,** don't. Use a template and Claude Code. A brand amplifies a position, and if the position is still moving, you are paying to personify something that will change. Come back after the pivot settles.",
      },
      {
        type: "paragraph",
        text: "**If cost is your only reason for switching,** a subscription at $699 to $4,995/mo will give you production without strategy, and that is genuinely the right trade for some teams.",
      },
      {
        type: "paragraph",
        text: "**If you have a locked Figma and a fixed set of comps,** hire a freelancer at $2–8k. You do not need anyone's opinion and you should not pay for one.",
      },
      {
        type: "paragraph",
        text: "**If your problem is pipeline volume,** hire a growth agency. Design makes every impression land harder. It does not create impressions.",
      },
      { type: "heading", text: "Red flags, fast filter" },
      { type: "paragraph", text: "Any of these, keep looking." },
      {
        type: "list",
        items: [
          "A portfolio of trendy sameness: the same gradient behind a different logo, page after page.",
          "No discovery or strategy phase in the proposal. They will decorate without understanding the problem.",
          "An awards wall with no metric anywhere near it.",
          '"We do everything" pitch with no visible specialty, which usually means no real depth in any lane.',
          '"Unlimited revisions," which sounds generous and means they have no point of view and will iterate until you make the decisions for them.',
          "A city-titled list padded with studios in other countries. Check three entries against their own contact pages before you trust any ranking, including this one.",
          "An agency-authored list that ranks itself first and does not say so, does not publish its price, and never names a job it loses. We rank ourselves first on this page. The other three are the tell.",
        ],
      },
      { type: "heading", text: "Does being headquartered in SF actually make an agency better?" },
      {
        type: "paragraph",
        text: "No, and that is worth saying on a page built around an SF filter.",
      },
      {
        type: "paragraph",
        text: "We applied the filter because the page promises it. A reader searching for San Francisco agencies usually has a reason: they want time-zone overlap, in-person sessions, or a vendor their procurement team will accept. Those are real constraints, and a list padded with studios in Ukraine and London fails that reader silently.",
      },
      {
        type: "paragraph",
        text: "But SF headquarters is not a quality signal, and we are not going to pretend otherwise to flatter a page we wrote. Some of the best studios for a funded B2B startup are nowhere near California, and a meaningful share of any SF rate is rent and overhead rather than craft.",
      },
      {
        type: "paragraph",
        text: "So use the filter if you have a reason for it. If you don't, ignore this page's premise entirely and judge on the work, the process, and who is actually on your account.",
      },
      { type: "heading", text: "FAQ" },
      { type: "subheading", text: "How much does a design agency cost in San Francisco?" },
      {
        type: "paragraph",
        text: "Brand identity typically runs $25–60k at startup-focused SF studios and $80–250k at prestige studios like Character, with network shops reaching $500k+. A marketing site runs $10–80k. Product and UX engagements run $25–150k+. The same brief varies roughly 25x depending on strategy depth, team seniority, and how much system you keep, not on the deliverable list.",
      },
      { type: "subheading", text: "Do I need an SF-based agency, or is remote fine?" },
      {
        type: "paragraph",
        text: "Remote is fine unless you have a specific reason it isn't, and the common reasons are real: procurement that requires a US-domiciled vendor, a team that works better in a room, or a compressed timeline where time-zone overlap matters. Absent one of those, SF headquarters is not a quality signal and you are better off judging the work.",
      },
      { type: "subheading", text: "Brand, web, or product design agency, which do I need?" },
      {
        type: "paragraph",
        text: "Brand if you are launching or rebranding and the story is unclear. Web if your identity is solid but the site underperforms. Product-UX if users get the pitch and churn inside the app. Early-stage teams usually get more from one partner doing brand and web together than from two vendors and a handoff.",
      },
      { type: "subheading", text: "How long does a startup rebrand take?" },
      {
        type: "paragraph",
        text: "A focused brand identity is typically 4–8 weeks. A full strategy-led rebrand runs longer: SF prestige studios quote 10 to 24 weeks, and network firms run three to six months. A marketing site on Webflow or Framer is 2–6 weeks from approved design. Our brand sprints run two weeks and sites three. Research depth is the biggest driver of the number.",
      },
      { type: "subheading", text: "Should brand and website be done together?" },
      {
        type: "paragraph",
        text: "For early-stage companies, usually yes. Your brand and your site are the same first impression, and splitting them across vendors tends to produce a site whose message and visuals disagree. A combined engagement keeps the story coherent and skips a handoff that costs weeks.",
      },
      { type: "subheading", text: "How much should a funded startup invest in brand?" },
      {
        type: "paragraph",
        text: "At Series A going upmarket, budget $25–60k and four to six weeks for brand plus website. Below $2M raised, spend near zero on agencies and use a template. At Series B with a category claim to defend, $80k+ at a prestige studio is a defensible line item. The filter is not what you can afford, it is whether your positioning is settled enough to amplify.",
      },
      { type: "subheading", text: "When should a startup hire a design agency vs a freelancer?" },
      {
        type: "paragraph",
        text: "Hire a freelancer when the strategy is locked, the scope is defined, and you need execution at $2–8k. Hire an agency when you need someone to take a position on what the brand should argue, when the work spans brand and site and product, or when you need a system maintained after launch. If you are still deciding what to say, a freelancer will build exactly what you asked for and it will be wrong.",
      },
      { type: "subheading", text: "What makes a B2B website feel trustworthy?" },
      {
        type: "paragraph",
        text: "Specificity and coherence. Named customers, real numbers, and a claim narrow enough to be falsifiable read as credible. Generic superlatives read as risk. Enterprise buyers are not judging whether your product is good, they are judging whether you will exist in three years, and coherence across the site, the deck, and the product is the main evidence they have before a call.",
      },
      { type: "subheading", text: "How do I brief a design agency?" },
      {
        type: "paragraph",
        text: 'Lead with the business problem, not the deliverable. Share your stage, your buyer, what is not working now, and how you will measure success. "We lost two enterprise deals after good demos" produces a much sharper proposal than "we need a rebrand." The clearer your problem, the faster you can tell who actually understands it.',
      },
      { type: "subheading", text: "Which design agency should a Series A startup going enterprise hire?" },
      {
        type: "paragraph",
        text: "If the constraint is budget and a deadline, a boutique sprint at $25–40k in two to five weeks fits the stage, and that is our lane. If the brand has to carry a category claim and you have raised a large round, Character or Ramotion are stronger. If the thing that needs designing is the AI product rather than the perception of the company, Punchcut or Fantasy. If your buying process involves a committee, go up a tier to Character or a network firm.",
      },
      { type: "subheading", text: "The bottom line" },
      {
        type: "paragraph",
        text: "The best design agency in San Francisco is not the one with the shiniest awards page, and it is not automatically the one at the top of a list that studio wrote itself. Ours is at the top of ours. Discount that accordingly and use the criteria instead: does the specialty match your actual gap, do the case studies show impact you can measure, and can your team still run the work six months after handoff.",
      },
      {
        type: "paragraph",
        text: "If you are a funded B2B or AI-native company that needs brand and website shipped by one team in weeks, that is our lane, and our prices are above so you can disqualify us in thirty seconds. If a studio on this list fits your job better, hire them.",
      },
      {
        type: "paragraph",
        text: 'Prices verified July 2026 from published pricing pages and Clutch profiles. Ranges marked "reported" are third-party estimates. Opaque pricing moves quietly, so re-check before you quote any of it.',
      },
    ],
  },
  {
    slug: "what-a-startup-rebrand-and-website-cost",
    title: "What a Startup Rebrand and Website Cost in 2026: By Stage, With Our Own Prices",
    description:
      "What a startup brand and website cost in 2026, broken down by funding stage, from $2k with a freelancer to $500k at a network firm, with our own prices.",
    categories: ["Design", "Branding"],
    image: "/media/blogs/blog-img-3.png",
    author: "Daksh, Founder at PIXELUP LABS",
    publishedDate: "2026-07-28",
    updatedDate: "2026-07-28",
    content: [
      {
        type: "paragraph",
        text: "A brand and website in 2026 costs $2–8k from a freelancer, $15–25k at seed, $25–40k from a boutique sprint at Series A, $50–150k from an established studio, and $80–500k from a prestige or network firm. Ours is $25–30k for a brand sprint and $25–40k with the website. What separates the tiers is strategy depth, team seniority, and how much system you keep, not the deliverable list.",
      },
      { type: "heading", text: "What to spend by stage" },
      {
        type: "table",
        headers: ["Stage", "Spend on Brand and Site", "Timeline", "What You Should Get"],
        rows: [
          [
            "Pre-seed / pre-PMF",
            "$0 to $3k",
            "a weekend",
            "A template, or Claude Code. Do not hire an agency.",
          ],
          [
            "Seed, under $2M raised",
            "$3k to $15k",
            "2–4 weeks",
            "A freelancer or a template plus a real writer. Positioning over polish.",
          ],
          [
            "Seed, $2M+ raised",
            "$15k to $30k",
            "4–8 weeks",
            "Positioning, identity, and a marketing site that says one clear thing.",
          ],
          [
            "Series A going upmarket",
            "$25k to $60k",
            "4–6 weeks",
            "Brand argument, site, and a design system your engineers can use.",
          ],
          [
            "Series B with a category claim",
            "$80k to $250k",
            "10–24 weeks",
            "Deep research, naming, multi-surface system, prestige-tier craft.",
          ],
          [
            "Series C and beyond",
            "$150k+",
            "3–6 months",
            "Network-firm process, global rollout, committee-ready governance.",
          ],
        ],
      },
      {
        type: "paragraph",
        text: "The row most founders get wrong is Series A. Hold that thought.",
      },
      { type: "heading", text: "The number the market will give you, and why we disagree" },
      {
        type: "paragraph",
        text: "Search this question and you will be told a growth-stage startup should invest $75,000 to $250,000 in brand. That guidance is everywhere, and it is written almost entirely by agencies whose floor is $80,000.",
      },
      {
        type: "paragraph",
        text: "We ship brand plus website for $25,000 to $40,000, in two to five weeks, for exactly that stage. So one of us is wrong, and it is worth being precise about which.",
      },
      {
        type: "paragraph",
        text: "Here is what the extra $200,000 genuinely buys:",
      },
      {
        type: "list",
        items: [
          "Research depth. Twenty stakeholder interviews and a segmentation study instead of four founder conversations and a competitor teardown.",
          "Naming. Legal search, linguistic screening, trademark clearance across jurisdictions. Real work, and expensive for good reason.",
          "Committee governance. A process built to survive six stakeholders who each need to feel heard. If you have a brand committee, you are buying this whether you want to or not.",
          "Multi-surface systems. Product UI, packaging, events, sales collateral, and a governance model for all of it.",
          "Insurance. At Series C, a botched rebrand is a nine-figure problem, and you are paying a firm whose process makes catastrophe unlikely.",
        ],
      },
      {
        type: "paragraph",
        text: "Here is what it does not buy: better taste. There is no correlation between a $200,000 invoice and a brand a buyer finds more credible. A prestige studio and a good boutique are drawing from the same talent pool, and often literally the same people at different points in their careers.",
      },
      {
        type: "paragraph",
        text: "So the honest version: if you have a committee, a naming problem, or a category to define at Series B, the market number is right and you should pay it. If you are a Series A founder who needs enterprise buyers to stop hesitating before a deadline, $75,000 is the price of a process you do not need yet.",
      },
      // { type: "heading", text: "Cost by stage, in detail" },
      { type: "heading", text: "Pre-seed and pre-PMF: $0 to $3,000" },
      {
        type: "paragraph",
        text: "Do not hire anybody. A brand amplifies a position, and if the position is still moving you are paying to personify something that will change. Use a template and Claude Code. If you spend money at all, spend it on a writer who can make your homepage say what you do.",
      },
      {
        type: "paragraph",
        text: "The counter-argument you will hear is that spending $20,000 at seed is cheaper than spending $60,000 rebranding after your Series A. That is true only if your positioning survives to Series A. Most pre-PMF positioning does not.",
      },
      { type: "heading", text: "Seed under $2M raised: $3,000 to $15,000" },
      {
        type: "paragraph",
        text: "A freelancer at $2,000 to $8,000 will give you a logo and a competent site if you arrive knowing what you want to say. Published market data puts freelance brand work at $1,500 to $8,000, and that is usually just the identity.",
      },
      {
        type: "paragraph",
        text: "At this level you are buying execution, not opinion. That is the correct trade. Budget separately for a writer.",
      },
      { type: "heading", text: "Seed with $2M+ raised: $15,000 to $30,000" },
      {
        type: "paragraph",
        text: "The market's seed package, roughly $15,000 to $25,000, buys positioning, logo, a color system, typography, and a simple website. Published allocations inside that number look like: $5,000 to $10,000 for a positioning workshop, $10,000 to $25,000 for identity from a boutique or senior freelancer, $5,000 to $15,000 for a basic site, and $2,000 to $5,000 for a pitch deck.",
      },
      {
        type: "paragraph",
        text: "Note those ranges overlap the total. That is normal and it is the tell: at seed you are choosing which two of those four things to actually fund.",
      },
      { type: "heading", text: "Series A going upmarket: $25,000 to $60,000" },
      {
        type: "paragraph",
        text: "This is our stage, so read the next few sentences with that in mind.",
      },
      {
        type: "paragraph",
        text: "A Series A company selling to enterprise for the first time has a specific problem: the product wins on capability and then the deal goes quiet, because a buying committee is trying to assess whether you will still exist at renewal. That is a perception problem with a deadline attached, usually a pipeline review or a Series B narrative that freezes in a quarter.",
      },
      {
        type: "paragraph",
        text: "What that needs is a brand that argues something, a site that says it in five seconds, and a design system so it does not decay. What it does not need is a five-month process.",
      },
      {
        type: "paragraph",
        text: "$25,000 to $40,000 buys that from a boutique in two to five weeks. $50,000 to $60,000 buys it with more product-design surface. Above that you are paying for research depth and governance, which are real, and which most Series A companies do not yet have a use for.",
      },
      { type: "heading", text: "Series B with a category claim: $80,000 to $250,000" },
      {
        type: "paragraph",
        text: "Now the market number is correct. Character runs $80,000 to $250,000. Focus Lab's Structural Rebrand runs $75,000 to $350,000 over three to five months. MetaLab starts at $100,000 and regularly reaches $150,000 to $250,000 or more.",
      },
      {
        type: "paragraph",
        text: "At this stage you likely have a stakeholder group, more than one product line, and a competitive claim that has to hold up under scrutiny for years. The research phase stops being a luxury.",
      },
      { type: "heading", text: "Series C and beyond: $150,000+" },
      {
        type: "paragraph",
        text: "Landor runs $100,000 to $500,000 and up. Pentagram runs $80,000 to $400,000 and up. You are buying process, governance, and global rollout capability, from a firm that will not fall over when your board changes its mind in month four.",
      },
      { type: "heading", text: "The four ways to buy design" },
      {
        type: "table",
        headers: ["Method", "Cost", "Speed", "Strategy Included?", "Who It Fails"],
        rows: [
          [
            "Template + Claude Code",
            "Free to $3k",
            "A weekend",
            "No",
            "Anyone selling to enterprise. You will look like the 200 other sites shipped that quarter.",
          ],
          [
            "Freelancer",
            "$2k–8k",
            "2–4 weeks",
            "No",
            "Anyone who has not decided what to say. Single-threaded, and ghosting is a real risk.",
          ],
          [
            "Productized subscription",
            "$699–$4,995/mo",
            "Ongoing, queued",
            "No",
            "Anyone needing a point of view. Great production, no argument.",
          ],
          [
            "Boutique sprint",
            "$25k–60k",
            "2–6 weeks",
            "Yes",
            "Committees, and budgets under $2M raised.",
          ],
          [
            "Prestige / network studio",
            "$80k–500k+",
            "3–6 months",
            "Yes, deeply",
            "Anyone on a deadline, or anyone who needs the money for headcount.",
          ],
        ],
      },
      { type: "heading", text: "What moves the price up or down" },
      {
        type: "list",
        items: [
          "Scope, in order of expense. Naming is the most expensive thing you can add, because it drags legal and linguistic work with it. Product UI is next. A marketing site is cheaper than either. A logo alone is cheapest and least useful.",
          "Whether you get a system. A brand handoff is a set of files. A design system is components, documentation, and templates your engineers can build against. The second costs more and is the difference between a brand that still looks sharp in twelve months and one that decays. On Greptile's 2025 rebrand and design system that meant 200+ components with dev-first documentation.",
          "Speed. Compressing a timeline costs money everywhere except at studios built for compression. Our sprints are two weeks for brand and three for a site because the process is designed that way, not because we are cutting corners on a five-month process.",
          "Strategy depth. Four founder conversations versus twenty stakeholder interviews is most of the gap between a $30,000 and a $150,000 engagement.",
          "Who is actually on your account. At a small studio the founders do the work. At a large one, seniority is what you are negotiating for, and it is the single most under-asked question in an agency evaluation.",
        ],
      },
      { type: "heading", text: "The costs the quote does not include" },
      {
        type: "paragraph",
        text: "Nobody in this category prints these, so here they are.",
      },
      {
        type: "list",
        items: [
          "The same brief varies 4x between vendors. A 10-page marketing site gets quoted $8,000 by one shop and $35,000 by another. That is not a quality signal in either direction, which is why you have to compare what is inside the number.",
          "Out-of-scope changes run $150 to $300 per hour. Three rounds of revisions on a logo alone can add $1,000 to $2,000.",
          "Implementation is not in the design fee. Common guidance is to budget two to three times the agency fee for total cost including implementation, legal, and operational rollout. That multiplier is real at enterprise scale. At Series A with one product and one website, it is closer to 1.2x, and anyone quoting you 3x at that stage is describing a project you are not running.",
          "Platform fees are ongoing. Framer runs $10 per month on Basic, $30 on Pro, and from $100 on Scale, plus $20 per editor seat and a $10 Content Editor seat added in May 2026. Webflow is comparable. Small numbers, but they are forever.",
          "Retainers are how the real cost accumulates. Basic maintenance runs $250 to $2,500 per month. A dedicated agency on standby is $2,000 to $6,000. Mid-market retainers run $5,000 to $15,000, and enterprise reaches $15,000 to $50,000 and up. Webflow-specific retainers span $1,000 per month for a freelancer to $40,000 and up for enterprise agencies.",
        ],
      },
      { type: "heading", text: "Our actual prices, and why we publish them" },
      {
        type: "list",
        items: [
          "Brand sprint: $25,000 to $30,000. Two weeks.",
          "Brand plus website: $25,000 to $40,000. Two to five weeks.",
          "Retainer: from $6,000 per month. Same team that ships the sprints, continuously.",
        ],
      },
      {
        type: "paragraph",
        text: "For comparison, on retainers: Focus Lab starts at $5,000 for execution and $10,000 for a brand team, Parallel's growth tier is $6,000 to $15,000, and Superside starts at $15,000. Ours starts at $6,000 for the team that did the sprint, which puts us at or near the floor of the retainer market rather than at the bottom of the whole list. Designjoy at $4,995 and ManyPixels at $699 are cheaper than we are, and both are subscriptions, so that comparison is throughput against judgment rather than like for like.",
      },
      {
        type: "paragraph",
        text: "We publish these for one reason: the number is the filter. Roughly half the people who read this page will now correctly disqualify us, and that is the point. It saves them a call and it saves us one.",
      },
      {
        type: "paragraph",
        text: "It also means we cannot quietly quote you differently than we quote the next founder, which is a discipline most of this industry avoids. When an agency will not publish a range, the usual reason is that the range depends on what they think you can pay.",
      },
      { type: "heading", text: "When the cheaper option is genuinely right" },
      { type: "paragraph", text: "We lose these, and we should." },
      {
        type: "list",
        items: [
          "You are pre-PMF. Use a template and Claude Code. Come back after the pivot settles. Hiring us now is the most expensive way to learn your positioning was wrong.",
          "You have raised under $2M. $25,000 is a headcount decision at that size. A freelancer at $2,000 to $8,000 plus a good writer will get you 80% of the outcome for 15% of the number.",
          "Your strategy is locked and the Figma is done. You need hands, not opinions. A freelancer is cheaper and faster, and we will spend your first week arguing with decisions you already made.",
          "Your rebrand needs a committee. We work founder-to-founder. If six stakeholders need to sign off, hire a Character- or Landor-tier firm whose process is built for it, and budget three to five times our number.",
          "Your problem is pipeline volume. Design makes every impression land harder. It does not create impressions. Hire a growth agency.",
          "You need steady production, not an argument. A subscription at $699 to $4,995 per month is a better instrument than a sprint.",
        ],
      },
      { type: "heading", text: "FAQ" },
      { type: "subheading", text: "How much does a rebrand cost?" },
      {
        type: "paragraph",
        text: "For a funded startup in 2026: $15,000 to $25,000 at seed, $25,000 to $60,000 at Series A, and $80,000 to $350,000 at Series B and beyond. Freelancers run $2,000 to $8,000 for identity alone. Prestige and network firms reach $500,000. The variable that moves the number most is research depth, not the deliverable list.",
      },
      { type: "subheading", text: "How much does branding cost for a startup?" },
      {
        type: "paragraph",
        text: "$15,000 to $25,000 buys the standard seed package: positioning, logo, color system, typography, and a simple website. Inside that, a positioning workshop is typically $5,000 to $10,000 and identity work is $10,000 to $25,000, which means at seed you are choosing which parts to actually fund rather than buying all of it.",
      },
      { type: "subheading", text: "How much does a website redesign cost?" },
      {
        type: "paragraph",
        text: "Most companies pay $15,000 to $80,000. The full published range runs $3,000 to $160,000 and up: agencies quote $3,000 to $75,000 per site, freelancers $3,000 to $10,000. Common tiers are a basic refresh at $10,000 to $25,000, a mid-range business redesign at $30,000 to $80,000, and an enterprise rebuild at $100,000 to $200,000 and up. A 10-page marketing site alone gets quoted anywhere from $8,000 to $35,000.",
      },
      { type: "subheading", text: "What do design agency retainers cost per month?" },
      {
        type: "paragraph",
        text: "Basic website maintenance runs $250 to $2,500 per month. A dedicated agency on standby is $2,000 to $6,000. Mid-market retainers run $5,000 to $15,000 and enterprise reaches $15,000 to $50,000 and up. Named options: ManyPixels $699, Designjoy $4,995, Focus Lab from $5,000, Superside from $15,000. Ours starts at $6,000.",
      },
      { type: "subheading", text: "How much should a funded startup invest in brand?" },
      {
        type: "paragraph",
        text: "At Series A going upmarket, $25,000 to $60,000 and four to six weeks for brand plus website. Under $2M raised, close to nothing. At Series B with a category claim to defend, $80,000 and up is defensible. The real filter is not what you can afford, it is whether your positioning is settled enough to be worth amplifying.",
      },
      { type: "subheading", text: "Should we rebrand before or after the raise?" },
      {
        type: "paragraph",
        text: "Before, if the brand is what is making investors hesitate, and if you can ship it in weeks rather than months. After, if the round is closing in under six weeks or your positioning will change based on what you learn raising. The failure mode is starting a five-month rebrand eight weeks before a raise and going into meetings mid-transition, looking less coherent than when you started.",
      },
      { type: "subheading", text: "How long does a startup rebrand take?" },
      {
        type: "paragraph",
        text: "A focused brand identity is 4 to 8 weeks. A marketing site on Framer or Webflow is 2 to 6 weeks from approved design. Our brand sprints run two weeks and sites three. Prestige studios quote 10 to 24 weeks, and Focus Lab's Structural Rebrand is three to five months. Research depth drives the timeline more than page count does.",
      },
      { type: "subheading", text: "Why do most design agencies not publish their prices?" },
      {
        type: "paragraph",
        text: "Because the range often depends on what the agency thinks you can pay. Publishing a number removes that flexibility, and it also disqualifies buyers before a sales conversation can happen. We think the disqualification is a feature: it is faster for everyone when a founder can rule us out in thirty seconds.",
      },
      { type: "subheading", text: "What is brand entropy, and why does it cost money?" },
      {
        type: "paragraph",
        text: "Brand entropy is what happens when a rebrand decays after launch because nobody left behind a system. Roughly eight months in, the deck stops matching the site, engineers invent components, and the brand you paid for is gone. It costs money twice: once for the original work, once for the rebrand that follows. A design system is the fix, and it is the line item most founders cut first.",
      },
      { type: "subheading", text: "When should a startup hire a freelancer instead of an agency?" },
      {
        type: "paragraph",
        text: "When the strategy is locked, the scope is defined, and you need execution. At $2,000 to $8,000 a good freelancer is the best value in this market. Hire an agency when someone needs to take a position on what the brand should argue, when the work spans brand and site and product, or when you need a system maintained after launch.",
      },
      { type: "heading", text: "The bottom line" },
      {
        type: "paragraph",
        text: "If you are pre-PMF, spend nothing. If you have raised under $2M, hire a freelancer. If you are at Series A and enterprise buyers are hesitating, $25,000 to $60,000 and four to six weeks is the right shape, and the $75,000 to $250,000 the internet quotes you is a process built for a company two stages ahead of yours. If you are at Series B defending a category claim, pay the market number, because at that point it is correct.",
      },
      {
        type: "paragraph",
        text: "Our numbers are above. If they disqualify us, that was the point of printing them. If they don't, our pricing page has the detail, and we keep lists of the studios we lose to in San Francisco and across AI.",
      },
      {
        type: "paragraph",
        text: "Market prices verified July 2026 from published pricing pages, agency cost guides, and Clutch profiles. This page decays faster than anything else we publish, so numbers get re-checked monthly. If you find one that has moved, tell us and we will fix it.",
      },
    ],
  },
  {
    slug: "agency-vs-freelancer-vs-design-subscription-vs-in-house",
    title:
      "Agency vs Freelancer vs Design Subscription vs In-House (2026): $27 an Hour to $240k a Year",
    description:
      "Agency, freelancer, design subscription, or in-house: real 2026 costs from $27 an hour to $240k a year, and which one fits your stage and deadline.",
    categories: ["Design", "Branding"],
    image: "/media/blogs/blog-img-4.png",
    author: "Daksh, Founder at PIXELUP LABS",
    publishedDate: "2026-07-31",
    updatedDate: "2026-07-31",
    content: [
      {
        type: "paragraph",
        text: "Pre-PMF, use a template or a freelancer. Funded, going upmarket, on a deadline: an agency sprint at $25–40k. High-volume production: a subscription at $549 to $5,000 a month. Ongoing senior design without a hire: an agency retainer from $6,000 a month. Shipping product weekly: hire in-house at $180–240k. Prices span $27 an hour to $240,000 a year, and the deciding question is not cost, it is who owns the argument.",
      },
      { type: "heading", text: "The 30-second decision table" },
      {
        type: "table",
        headers: ["Your situation", "Right option", "What it costs"],
        rows: [
          ["Pre-PMF, positioning still moving", "Template, or a freelancer", "$0–8k"],
          [
            "Strategy locked, scope defined, need execution",
            "Freelancer",
            "$2–8k per project",
          ],
          ["Funded, going upmarket, hard deadline", "Agency sprint", "$25–40k"],
          [
            "Category claim at Series B, committee involved",
            "Prestige agency",
            "$80–250k",
          ],
          ["High volume of predictable assets", "Subscription", "$549–$5,000/mo"],
          ["High volume plus video and motion", "Enterprise subscription", "$10,000+/mo"],
          [
            "Ongoing senior design, not ready for headcount",
            "Agency retainer",
            "From $6,000/mo",
          ],
          [
            "Post-launch, own the system, ship product weekly",
            "In-house hire",
            "$180–240k/yr",
          ],
        ],
      },
      {
        type: "paragraph",
        text: "Two of those rows are ours: the sprint and the retainer. We will mark where that biases us.",
      },
      { type: "heading", text: "Who owns the argument" },
      {
        type: "paragraph",
        text: "Here is the thing nobody says in these comparisons: most of these options give you production and quietly assume you arrive with the argument already made.",
      },
      {
        type: "paragraph",
        text: "A freelancer builds what you brief. A subscription executes what you queue. An in-house designer inherits whatever positioning already exists. All three are excellent at making things. None of them is responsible for deciding what your brand should say.",
      },
      {
        type: "paragraph",
        text: "That is fine when you know. It is expensive when you don't, because you will pay to produce the wrong thing beautifully, then pay again.",
      },
      {
        type: "paragraph",
        text: "So run the cost comparison, but answer this first: is your positioning settled? If yes, buy the cheapest competent production you can find, and at $27 an hour that floor has never been lower. If no, that is the actual purchase, and it narrows your options considerably.",
      },
      { type: "heading", text: "Real costs side by side" },
      {
        type: "table",
        headers: ["", "What it costs", "Speed", "Strategy included?", "Biggest risk"],
        rows: [
          [
            "Freelancer",
            "$27/hr Upwork median, $45–85/hr mid-market, $80–130/hr+ senior. $2–8k per project",
            "2–4 weeks",
            "No",
            "Single-threaded. Ghosting. Nobody owns the argument.",
          ],
          [
            "Subscription",
            "$549/mo entry, $1,299/mo dedicated designer, $4,995/mo unlimited, $10,000+/mo enterprise",
            "Ongoing, queued",
            "No",
            "Queue-based output. You become the creative director.",
          ],
          [
            "Agency sprint",
            "$25–40k boutique, $80–250k prestige",
            "2–6 weeks boutique, 3–6 months prestige",
            "Yes",
            "Cost. A bad fit is expensive and slow to unwind.",
          ],
          [
            "Agency retainer",
            "From $6,000/mo, market $5,000–15,000/mo",
            "Continuous",
            "Yes",
            "You are renting a slice of a team, not all of it.",
          ],
          [
            "In-house",
            "$146k average base, $180–240k true first-year cost",
            "3–6 months to productive",
            "Inherits it",
            "Ramp time. One person cannot span brand, product, and web.",
          ],
        ],
      },
      { type: "heading", text: "Freelancer" },
      {
        type: "paragraph",
        text: "**What it costs.** Upwork's median rate for UX design is $27 an hour, and rates there cluster around $25 because you are competing in a race to the bottom. Longer commitments soften it: a six-month contract at 20 hours a week typically runs $50 to $90 an hour. Outside Upwork, the broader freelance market runs $25 to $150 an hour, with mid-level remote designers at $45 to $85 and an average near $65. Designers who can argue their decisions in business terms command $80 to $130 and up.",
      },
      {
        type: "paragraph",
        text: "**Where it genuinely wins.** Locked strategy, defined scope, and a real need for hands. At $2,000 to $8,000 a good freelancer is the best value in this entire market, and we say that as an agency. If you have the Figma, the copy, and the decisions made, paying us is paying for an argument you have already had.",
      },
      {
        type: "paragraph",
        text: "**Where it breaks.** Single-threaded by definition, so illness, a better offer, or a bigger client stalls you. Nobody owns the strategy, so a vague brief produces a confident wrong answer. And the good ones are managing several clients at once, which is fine until your timeline is the one that slips.",
      },
      {
        type: "paragraph",
        text: "**Red flags.** A portfolio with no named clients. Rates at the very bottom of the Upwork band for work you described as important. No questions about your buyer. Unwillingness to disagree with your brief.",
      },
      { type: "heading", text: "Design subscription" },
      {
        type: "paragraph",
        text: "**What it costs.** The market spans $549 a month to over $10,000. ManyPixels starts at $549 for its Advanced plan, with a dedicated designer from $1,299. Designjoy is a single plan at $4,995, founded by Brett Williams in 2017 and still run entirely by him, which means one consistent senior designer rather than a rotating pool. Superside advertises from around $5,000, but client reports put real engagements at $10,000 a month scaling past $100,000, on twelve-month commitments with a $120,000 annual minimum.",
      },
      {
        type: "paragraph",
        text: "Note the model difference, because it decides value: Designjoy is unlimited requests at a flat fee, Superside is capacity-based hours. Unpredictable high volume favors the flat fee. Multi-discipline work spanning video and motion favors capacity.",
      },
      {
        type: "paragraph",
        text: "**Where it genuinely wins.** Steady, predictable, high-volume production. Ad variants, landing pages, deck templates, social assets, event collateral. If your bottleneck is throughput and you already know what good looks like, this is the most efficient instrument on the list, and nothing else here competes on cost per asset.",
      },
      {
        type: "paragraph",
        text: "**Where it breaks.** There is no positioning in a queue. You are the creative director, and the quality of the output is capped by the quality of your briefs. Turnaround is per-request, so a coherent brand system spanning ten surfaces is a bad fit for a model built around discrete tickets.",
      },
      {
        type: "paragraph",
        text: "**Red flags.** \"Unlimited\" without a stated daily or weekly output rate. Rotating anonymous designers with no continuity. Twelve-month lock-ins at the entry tier. No named senior on your account.",
      },
      { type: "heading", text: "Agency sprint" },
      {
        type: "paragraph",
        text: "**Our bias, stated:** this is our primary model.",
      },
      {
        type: "paragraph",
        text: "**What it costs.** Boutique sprints run $25,000 to $40,000 over two to six weeks. Ours are $25,000 to $30,000 for a brand sprint and $25,000 to $40,000 with the website, in two to five weeks. Prestige studios run $80,000 to $250,000 over three to six months. There is a longer breakdown by stage in what a startup rebrand and website cost.",
      },
      {
        type: "paragraph",
        text: "**Where it genuinely wins.** When the positioning is not settled and there is a deadline. That is the narrow case, and it is the only one where paying sprint rates is clearly rational: you are buying an opinion plus the execution of it, compressed, from people who have run the motion before. Also when the work spans brand, site, and product at once, because that is exactly where handoffs between separate vendors lose the story.",
      },
      {
        type: "paragraph",
        text: "**Where it breaks.** It is the most expensive option per unit of output by a wide margin, and it is the wrong instrument for anything ongoing. A sprint also ends, which means without a retainer or an in-house hire behind it the system starts decaying in about eight months. And a bad fit is slow and expensive to unwind, unlike a freelancer you simply stop booking.",
      },
      {
        type: "paragraph",
        text: "**Red flags.** No published price. No discovery phase. No opinion on your messaging. Unlimited revisions, which means no point of view. A twelve-week quote for a fifteen-page marketing site.",
      },
      { type: "heading", text: "Agency retainer" },
      {
        type: "paragraph",
        text: "**Our bias, stated:** we sell this, so weigh the section accordingly. The pricing below is public and checkable.",
      },
      {
        type: "paragraph",
        text: "**What it costs.** Market retainers run $5,000 to $15,000 a month at mid-market and $15,000 to $50,000 at enterprise. Named: Focus Lab starts at $5,000 for design execution and $10,000 for a dedicated brand team, Parallel's growth tier is $6,000 to $15,000, and Superside effectively starts at $10,000. Ours starts at $6,000 a month, and it is the same team that ships our sprints rather than a separate delivery pool.",
      },
      {
        type: "paragraph",
        text: "That puts an agency retainer in the middle of the market rather than at the bottom of it. Designjoy at $4,995 and ManyPixels at $549 are cheaper than we are, and both are subscriptions, so that comparison is throughput against judgment rather than like for like. Against actual retainers we sit at or near the floor: Focus Lab's execution tier is $5,000 and its dedicated brand team is $10,000, Parallel's growth tier starts at $6,000, Superside effectively starts at $10,000. And at $72,000 a year, a retainer is roughly a third of what a first design hire really costs.",
      },
      {
        type: "paragraph",
        text: "**Where it genuinely wins.** Three situations. You shipped a brand and need someone senior keeping it coherent without adding headcount yet. You need ongoing design work where each request requires judgment rather than execution, so a queue would produce confident wrong answers. Or you are between \"we have no designer\" and \"we can justify a $200k hire,\" which is where most Series A companies actually live for four to six quarters.",
      },
      {
        type: "paragraph",
        text: "**Where it breaks.** It is genuinely bad at volume. If you need fifty ad variants a month, a retainer is the most expensive way to buy that and a subscription is the correct instrument. You are also renting a slice of a team, so you do not get someone in your standups every morning; if design is on your critical path daily, you want a hire. And retainers quietly become expensive when nobody is scoping them: $6,000 a month for work you could have briefed to a freelancer twice a year is waste.",
      },
      {
        type: "paragraph",
        text: "**Red flags.** No stated scope or output expectation. No named senior. A retainer proposed when what you described was one project. Any agency that will not tell you what happens to unused capacity.",
      },
      { type: "heading", text: "In-house" },
      {
        type: "paragraph",
        text: "**What it costs.** The average US product designer salary is $146,087, with other sources between $119,000 and $144,000, and a senior product designer around $145,000 before benefits, equity, and equipment. Brand designers run $86,650 to $108,211.",
      },
      {
        type: "paragraph",
        text: "But base salary is the smaller half of the story. The true first-year cost of a design hire is 1.4x to 2.4x base, which is roughly $180,000 to $240,000 on a $120,000 hire, once you load a 30 to 40% benefits burden, recruiting costs, and the quarter or more they spend ramping before shipping anything you would put in front of a buyer.",
      },
      {
        type: "paragraph",
        text: "**Where it genuinely wins.** After the brand exists. An in-house designer is the best possible steward of a system: they hold context, they are in the standups, they ship weekly with the product team, and they stop brand entropy before it starts. For product velocity there is no substitute, and no retainer or subscription will ever match someone who is in the room.",
      },
      {
        type: "paragraph",
        text: "**Where it breaks.** Ramp time is the killer when you have a deadline. If your Series B narrative freezes in eight weeks, a hire who becomes productive in month four does not solve your problem. And one person cannot credibly span brand strategy, product UI, and web production; they will be excellent at one, competent at the second, and quietly drowning in the third.",
      },
      {
        type: "paragraph",
        text: "**Red flags in your own thinking.** Hiring a designer to figure out your positioning. Hiring one person and expecting three specialties. Hiring before there is a system for them to steward, which makes their first year an unsupported rebrand.",
      },
      { type: "heading", text: "Agency retainer vs design subscription" },
      {
        type: "paragraph",
        text: "These two get compared constantly and they are not the same product.",
      },
      {
        type: "table",
        headers: ["", "Design subscription", "Agency retainer"],
        rows: [
          ["What you are buying", "Throughput", "Judgment"],
          ["Cost", "$549–$10,000+/mo", "$5,000–15,000/mo market, ours from $6,000"],
          ["Strategy", "No", "Yes"],
          ["Model", "Request queue, flat fee or capped hours", "Scoped ongoing engagement"],
          [
            "Continuity",
            "Varies. Designjoy is one senior designer, most are a pool",
            "The team that built the thing",
          ],
          ["Best at", "Fifty variants of a known asset", "Ten decisions that each need an opinion"],
          ["Worst at", "Anything requiring a point of view", "High-volume commodity production"],
        ],
      },
      {
        type: "paragraph",
        text: "The honest test: count the decisions. If your next quarter of design work is mostly production against decided direction, a subscription is cheaper and faster, and you should buy one. If it is mostly judgment calls, a queue will hand you confident wrong answers and a retainer costs less than the rework.",
      },
      { type: "heading", text: "What AI did to design hiring" },
      {
        type: "paragraph",
        text: "The freelance market split in half, and the numbers show it clearly.",
      },
      {
        type: "paragraph",
        text: "At the bottom, AI collapsed the floor. Producing a competent-looking page is now nearly free, which is why Upwork's median UX rate sits at $27 an hour and the entry tier is a race to the bottom. If what you are buying is execution of a decided idea, you have never had more leverage as a buyer.",
      },
      {
        type: "paragraph",
        text: "At the top, the opposite happened. Upwork's February 2026 In-Demand Skills report found freelancers working on AI-related projects earn 44% more per hour than those on non-AI work, and designers who use AI to build sites earn roughly 21% more per year than those who don't.",
      },
      {
        type: "paragraph",
        text: "So the same tool that made production cheap made judgment expensive. The scarce thing is no longer someone who can make a page. It is someone who knows which page to make, and can tell you that your positioning is the problem rather than your hero section.",
      },
      {
        type: "paragraph",
        text: "That is also why \"we built it with Claude Code over a weekend\" is now a category-wide problem rather than a clever shortcut. When everyone can produce the same competent page from the same prompts, the page stops differentiating and starts signaling that you are one of the two hundred companies that shipped it that quarter. There is more on that failure mode in our list of design agencies for AI startups.",
      },
      { type: "heading", text: "One founder who bought three of these four" },
      {
        type: "paragraph",
        text: "In July 2026, David Walsh, a three-time founder and the CEO of Limelight, posted publicly about hiring us. We are about to quote a client complimenting us on our own page, so discount it accordingly. The reason it belongs here is not the compliment, it is that he has personally bought three of the four models on this list and said what he found:",
      },
      {
        type: "paragraph",
        text: "\"over the last 12 years, I've worked with: Big-name website agencies. 'Top-rated' Upwork freelancers. Designers with huge followings. And none came close.\"",
      },
      {
        type: "paragraph",
        text: "He found us through a cold email whose subject line was \"Most founders spend $50k on a sh*tty website that does f*ck all,\" which we will not defend as elegant, and then hired a four-person team: Daksh Aswal, Dhruv Gupta, Rinkesh Bist, and Krish Savani. He named all four in the post, which almost nobody does. ([Read it on LinkedIn](https://www.linkedin.com/posts/david-walsh-limelight_12-weeks-ago-i-hired-these-four-lads-from-share-7479919094905966592-_0LN/))",
      },
      {
        type: "paragraph",
        text: "What survives the discount is the shape of his comparison. Twelve years of buying history across the big agency, the top-rated freelancer, and the designer with the audience, and the deciding variable turned out to be none of the things those three categories sort on. Not budget tier, not platform, not follower count.",
      },
      {
        type: "paragraph",
        text: "His own conclusion was about geography, and it is the reason he wrote the post rather than just paying the invoice: \"There is talent everywhere. Don't let small minded thinking stop you from finding it.\"",
      },
      { type: "heading", text: "When you should not hire us" },
      {
        type: "paragraph",
        text: "We lose all of these, and we should.",
      },
      {
        type: "paragraph",
        text: "**You are pre-PMF.** Use a template. A brand amplifies a position, and if the position is still moving you are paying to personify something that will change.",
      },
      {
        type: "paragraph",
        text: "**Your strategy is locked and the Figma is done.** Hire a freelancer at $2,000 to $8,000. We will spend your first week arguing with decisions you have already made, and you will resent paying for it.",
      },
      {
        type: "paragraph",
        text: "**You need high-volume commodity production.** Fifty ad variants a month is a subscription job. Our retainer is priced for judgment, not throughput, and buying it for volume is the most expensive way to get volume.",
      },
      {
        type: "paragraph",
        text: "**Your rebrand needs a committee.** We work founder-to-founder. Six stakeholders needing sign-off means hiring a Character- or Landor-tier firm at three to five times our number, whose process is built for it.",
      },
      {
        type: "paragraph",
        text: "**Your problem is pipeline volume.** Hire a growth agency. Design makes every impression land harder; it does not create impressions.",
      },
      {
        type: "paragraph",
        text: "**Design is on your critical path every day.** If someone needs to be in standup every morning making calls with the product team, hire in-house. A retainer is a slice of a team, and no slice beats a person in the room.",
      },
      { type: "heading", text: "FAQ" },
      { type: "subheading", text: "Agency vs freelancer: which should a startup pick?" },
      {
        type: "paragraph",
        text: "Freelancer if your strategy is locked and you need execution, at $2,000 to $8,000. Agency if the positioning is unsettled, there is a deadline, or the work spans brand and site and product at once, at $25,000 to $40,000 for a boutique sprint. The deciding question is whether you are buying hands or an opinion.",
      },
      { type: "subheading", text: "Is a design subscription worth it?" },
      {
        type: "paragraph",
        text: "Yes, for steady high-volume production: ad variants, landing pages, deck templates, social assets. At $549 to $4,995 a month it is the cheapest way to buy throughput and nothing else competes on cost per asset. No, if you need positioning or a coherent system across many surfaces, because a request queue cannot produce a brand argument. For ongoing work that needs judgment rather than volume, an agency retainer from $6,000 a month is the closer fit.",
      },
      {
        type: "subheading",
        text: "What is the difference between an agency retainer and a design subscription?",
      },
      {
        type: "paragraph",
        text: "A subscription sells throughput through a request queue; a retainer sells judgment through a scoped ongoing engagement. Subscriptions run $549 to $10,000 and up per month, retainers $5,000 to $15,000, ours from $6,000. Count the decisions in your next quarter: mostly production against decided direction means buy a subscription, mostly judgment calls means a retainer costs less than the rework.",
      },
      { type: "subheading", text: "Should we hire an in-house designer or use an agency?" },
      {
        type: "paragraph",
        text: "Hire in-house once the brand exists and needs stewarding, and when you ship product weekly. Use an agency when the brand does not exist yet or is wrong and there is a deadline, because a new hire takes three to six months to become productive. The common sequence that works: an agency sprint builds the system, a retainer holds it together, then a hire takes it over once the volume justifies $180,000 to $240,000 a year.",
      },
      { type: "subheading", text: "How much does a freelance designer cost in 2026?" },
      {
        type: "paragraph",
        text: "Upwork's median UX rate is $27 an hour, with the entry tier clustered near $25. Mid-level remote designers run $45 to $85, the broader market averages around $65, and senior designers who can argue business impact charge $80 to $130 and up. Project work typically lands between $2,000 and $8,000.",
      },
      { type: "subheading", text: "What does a design subscription cost?" },
      {
        type: "paragraph",
        text: "From $549 a month at ManyPixels' Advanced tier, $1,299 for a dedicated designer, $4,995 for Designjoy's unlimited plan, and $10,000 a month and up for Superside, which carries twelve-month commitments and a $120,000 annual minimum. Flat-fee unlimited suits unpredictable volume; capacity-based hours suit multi-discipline work.",
      },
      { type: "subheading", text: "What does a design agency retainer cost per month?" },
      {
        type: "paragraph",
        text: "Mid-market retainers run $5,000 to $15,000 a month and enterprise reaches $15,000 to $50,000 and up. Named options: Focus Lab from $5,000 for execution and $10,000 for a brand team, Parallel $6,000 to $15,000, Superside effectively from $10,000. Ours starts at $4,000 with the same team that ships our sprints.",
      },
      { type: "subheading", text: "What does an in-house designer really cost?" },
      {
        type: "paragraph",
        text: "Budget 1.4x to 2.4x base salary for the first year, which is roughly $180,000 to $240,000 on a $120,000 hire. The multiplier covers a 30 to 40% benefits load, recruiting, and the quarter or more of ramp before they ship anything buyer-facing. Average US product designer base is around $146,000.",
      },
      { type: "subheading", text: "Upwork designer vs design agency: what is the real difference?" },
      {
        type: "paragraph",
        text: "Scope of responsibility. An Upwork designer at $27 an hour executes a brief and is not accountable for whether the brief was right. An agency is accountable for the argument, the execution, and the system that outlives both. If your brief is right, the Upwork designer is dramatically better value.",
      },
      { type: "subheading", text: "Can we just use AI instead of hiring anyone?" },
      {
        type: "paragraph",
        text: "For production, increasingly yes, and pre-PMF that is the correct answer. The catch is that everyone else is doing it with the same models, so the output converges. If your buyers are comparing you to three alternatives, a site that looks like theirs is doing no work in that comparison.",
      },
      { type: "subheading", text: "Can we combine these options?" },
      {
        type: "paragraph",
        text: "Usually the best answer, and it is what most of our clients end up doing. The pattern that works: a sprint to build the brand and system, a retainer or a subscription for the ongoing work depending on whether it needs judgment or volume, then an in-house hire once there is enough of both to justify the salary. The failure pattern is buying two of them for the same job and letting the handoff eat the story.",
      },
      { type: "subheading", text: "The bottom line" },
      {
        type: "paragraph",
        text: "Cost is the wrong first question. Ask whether your positioning is settled. If it is, buy the cheapest competent production available, and at $27 an hour that floor has never been lower. If it isn't, that is the actual purchase, and it rules out three of the five options on this page.",
      },
      {
        type: "paragraph",
        text: "Then ask what the next quarter actually contains. Volume points at a subscription. Judgment points at a retainer. A deadline and an unsettled story point at a sprint. Daily product work points at a hire.",
      },
      {
        type: "paragraph",
        text: "Ours are $25,000 to $30,000 for a brand sprint, $25,000 to $40,000 with the website, and retainers from $6,000 a month with the same team, all on our pricing page. If another option above fits your situation better, take it. We would rather lose the call than the reputation.",
      },
      {
        type: "paragraph",
        text: "Rates verified July 2026 from Upwork's published rate data, provider pricing pages, and salary aggregators. Freelance and subscription pricing moves fast, so re-check before quoting any of it.",
      },
    ],
  },
];

// Must match metadataBase in app/layout.tsx — www, not the apex, which redirects.
const BASE_URL = "https://www.pixeluplabs.com";

/**
 * BlogPosting structured data for one post, rendered by BlogPostPage.
 *
 * `datePublished` / `dateModified` are the point of it: posts already carried
 * `publishedDate` / `updatedDate` but only rendered them as visible text,
 * which crawlers and AI answer engines don't read as date signals. Article
 * schema is also what makes a post eligible to be cited with a date attached.
 */
export function blogPostSchema(post: BlogPost) {
  // "Daksh, Founder at PIXELUP LABS" -> name + jobTitle. Split on the first
  // comma only, so a job title containing commas survives intact.
  const commaIndex = post.author.indexOf(",");
  const authorName =
    commaIndex === -1 ? post.author : post.author.slice(0, commaIndex).trim();
  const authorTitle =
    commaIndex === -1 ? undefined : post.author.slice(commaIndex + 1).trim();

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${BASE_URL}/blog/${post.slug}#article`,
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
    headline: post.title,
    description: post.description,
    image: `${BASE_URL}${post.image}`,
    articleSection: post.categories,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
    author: {
      "@type": "Person",
      name: authorName,
      ...(authorTitle ? { jobTitle: authorTitle } : {}),
    },
    publisher: {
      "@type": "Organization",
      name: "PIXELUP LABS",
      url: `${BASE_URL}/`,
      logo: {
        "@type": "ImageObject",
        url: `${BASE_URL}/media/nav-logo.svg`,
      },
    },
  };
}

/**
 * Newest `updatedDate` across all posts. The /blog index is only as fresh as
 * its newest post, so it derives its freshness signals from this rather than
 * carrying a hand-maintained date in lib/site-dates.ts — a new post updates
 * the index automatically. ISO `YYYY-MM-DD` sorts lexicographically, which is
 * why a plain string compare is safe here.
 */
export const blogIndexUpdated = blogPosts.reduce(
  (latest, post) => (post.updatedDate > latest ? post.updatedDate : latest),
  "",
);

/** "2026-07-07" -> "JUL 7, 2026" */
export function formatBlogDate(date: string): string {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    .toUpperCase();
}

/** Rough reading time from word count at 200wpm, e.g. "6 MIN READ". */
export function estimateReadTime(content: BlogContentBlock[]): string {
  const wordCount = content.reduce((count, block) => {
    const text =
      block.type === "list"
        ? block.items.join(" ")
        : block.type === "table"
          ? [block.headers, ...block.rows].flat().join(" ")
          : block.text;
    return count + text.split(/\s+/).filter(Boolean).length;
  }, 0);
  const minutes = Math.max(1, Math.round(wordCount / 200));
  return `${minutes} MIN READ`;
}

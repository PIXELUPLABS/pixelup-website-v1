/** One block of article body content — paste real copy in as a sequence of
    these, in reading order. Add a new variant here if a post needs a shape
    that doesn't fit yet (e.g. a quote or an image block). */
export type BlogContentBlock =
  | { type: "heading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][] };

export interface BlogPost {
  slug: string;
  title: string;
  category: string;
  image: string;
  author: string;
  publishedDate: string;
  updatedDate: string;
  content: BlogContentBlock[];
}

export const blogPosts: BlogPost[] = [
  {
    slug: "best-design-agencies-for-ai-startups-2026",
    title:
      "Best Design Agencies for AI Startups (2026): Who Designed Midjourney, Cursor, and Greptile",
    category: "Design",
    image: "/media/blog-banner-bg.png",
    author: "Daksh, PIXELUP LABS",
    publishedDate: "2026-07-25",
    updatedDate: "2026-07-25",
    content: [
      {
        type: "paragraph",
        text: "MetaLab rebuilt Midjourney's interface, built Suno's brand, and built Windsurf's brand system, starting at $100k. basement.studio worked with Cursor, Harvey, Scale, and Replicate, starting near $10k. Lazarev has shipped 30+ AI products. Our sprints run $25–30k. Which one you want depends on whether the hard part is your product or your positioning. Ten studios below, with real prices and where each one loses.",
      },
      {
        type: "paragraph",
        text: "Disclosure, up front: we wrote this list and we put ourselves at number one. Read our entry with that in mind. Instead of pretending to be neutral: we publish our actual prices, name five things we are bad at, and hand five specific jobs on this page to studios that beat us at them.",
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
          "Technical translation. Can they turn a complex product into plain buyer language without making it wrong?",
          "Dual-audience design. Do developers and non-technical buyers both get served on the same page, or does one get sacrificed?",
          "Enterprise trust signals. Are security, SOC 2, and model transparency designed surfaces, or footer links?",
          "Conversion architecture. Demo and trial journeys, not brochures.",
          "Shipping speed. AI positioning has a short shelf life. Can they keep pace when yours moves?",
        ],
      },
      {
        type: "paragraph",
        text: "How we know. We have run 31 projects for funded B2B and AI-native startups, including Greptile, Sully, Bland, Reducto, and CTGT. We hold 5.0★ across every review we've received. And we publish our own prices on this site, which almost nobody in this category does.",
      },
      {
        type: "paragraph",
        text: 'On self-ranking, since we do it. Every agency-authored list has a thumb on the scale, and you should know where each one puts itself. Parallel published its AI-startup list on 2 July 2026 and ranked itself #1. Punchcut publishes one titled "An Honest Comparison." We rank ourselves #1 here.',
      },
      {
        type: "paragraph",
        text: "So do not read the ordering as a neutral verdict. Read it as our pitch with the receipts attached. What you can actually check on this page is the prices, the limitations in every entry including ours, and the five jobs we hand to other studios in the box above.",
      },
      {
        type: "paragraph",
        text: "Who this is for: B2B AI companies from seed through Series C hiring a design partner. Who it is not for: consumer apps, teams shopping for the cheapest template, or companies that need a full in-house product-design department rather than a partner.",
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
      { type: "heading", text: "PIXELUP LABS (us)" },
      {
        type: "paragraph",
        text: "Price: brand sprint $25–30k · brand + website $25–40k · retainer from $4k/mo (full pricing) · Timeline: 2-week brand sprints, 3-week sites · Stack: Framer, Webflow, custom when the product needs it",
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
        text: "Where it shines: brand and website as one engagement, one team, in two to five weeks, with the design system left behind so it does not decay eight months later. On Greptile's 2025 engagement that meant 200+ components and dev-first documentation.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't:",
      },
      {
        type: "list",
        items: [
          "We are not a committee studio. We work founder-to-founder. If your rebrand needs a steering committee and a stakeholder matrix, hire a Character-tier firm and budget three to five times our number.",
          "We are not a pair of hands. We take a position on messaging and positioning. If your strategy is locked and the Figma is done, a freelancer at $2–8k is cheaper and faster.",
          "We are not a product-design department. We do product design inside a brand engagement. If you need a team embedded in your sprint cadence for a year, that is a different hire.",
          "Our team works from Bangalore, on Pacific overlap. If procurement requires an on-site or US-domiciled delivery team, apply that filter early.",
          "$25–30k is real money at seed. Under $2M raised, we are the wrong line item and a template is the honest answer.",
        ],
      },
      {
        type: "paragraph",
        text: "Verdict: hire us for AI-native B2B going enterprise on a Series A budget and a deadline. For a product used by millions, MetaLab. For the craft your peer set hired, basement. For a shipped agent, Punchcut. For a cheaper sprint, Parallel.",
      },
      { type: "heading", text: "MetaLab" },
      {
        type: "paragraph",
        text: "Price: $100k minimum, regularly $150–250k+, ~$150–199/hr · Location: Victoria BC, distributed",
      },
      {
        type: "paragraph",
        text: "MetaLab designed the original Slack interface, and that product-first DNA runs straight through their AI work. They moved Midjourney off Discord into its own web interface, built Suno's brand and the interface behind it, and built Windsurf's brand system across marketing site and product. Other clients include Coinbase, Oculus, Robinhood, Uber, and Google.",
      },
      {
        type: "paragraph",
        text: "Where it shines: AI products where the interface is the value and it will be used by very large numbers of people. Nobody on this list has done that more times.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: the $100k floor and multi-month timelines are a hard filter. If you are pre-Series B with finite runway and a conference in eight weeks, this is the wrong shape of engagement, and no amount of wanting it changes that.",
      },{
        type: "paragraph",
        text: "Verdict: the best product studio here, full stop, if you can afford the floor. They beat us on product depth and on scale experience by a wide margin.",
      },
      { type: "heading", text: "basement Studio" },
      {
        type: "paragraph",
        text: "Price: $10k+ minimum, $100–149/hr · Location: Buenos Aires and LA, 35 people The most striking client roster in this category: Cursor, Scale, Harvey, Baseten, Black Forest Labs, Replicate, Linear, and Vercel. If you are an AI infra or devtools founder, this is the studio your peer set already hired. Webby and Awwwards recognition, and a reputation on design Twitter that they earned through the work rather than through marketing.",
      },
      {
        type: "paragraph",
        text: "Where it shines: modern tech craft, immersive web, and the specific visual language that reads as credible to a developer audience. The price-to-craft ratio is the best on this page.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: they are a craft and web studio more than a positioning shop. If you arrive without a clear point of view about your market, you will get a beautiful expression of an unclear idea. Also 35 people in Argentina means timezone math for a US West Coast team.",
      },
      {
        type: "paragraph",
        text: "Verdict: if your positioning is settled and you want the aesthetic your competitors' engineers respect, hire basement. They beat us on pure craft and on peer-set signaling.",
      },
      { type: "heading", text: "Lazarev" },
      {
        type: "paragraph",
        text: "Price: ~$100/hr · Location: San Francisco, founded 2015 by Kyrylo Lazariev, 50+ team Designing AI products since 2017, with 30+ shipped across copilots, decision engines, and data-heavy platforms. Three consecutive years of Webby recognition for AI products, including Best Visual Design for AI at the 30th Annual Webby Awards. Their Accern work built AI research tooling for analysts and VCs. Their stated principle is blunt and correct: if design is not moving adoption or revenue, it is decoration.",
      },
      {
        type: "paragraph",
        text: "Where it shines: the hardest problem in this category, which is making intelligence feel simple and trustworthy inside a demo, a POC, or a QBR. They are also the most visible studio in the category across organic and AI search, which tells you something about how they think about distribution.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: they lean product and UX over marketing brand. A pure positioning-and-identity engagement is not the center of their practice.",
      },
      {
        type: "paragraph",
        text: "Verdict: strong when the product and the website have to tell one coherent story about a complex model.",
      },
      { type: "heading", text: "Punchcut" },
      {
        type: "paragraph",
        text: "Price: enterprise, project-based · Location: San Francisco, founded 2002 Two decades at the frontier of human-machine interaction: voice interfaces, AI agents, automotive systems, and multimodal experiences for Google, Amazon, Ford, Samsung, LG, Salesforce, and Johnson & Johnson. Their Design Accelerator model ships production-ready products in 6 to 12 weeks by pairing senior teams with proven interaction patterns and build-to-learn prototyping.",
      },
      {
        type: "paragraph",
        text: "Where it shines: when the deliverable is an intelligent product, an agent, or an interface that has to actually ship, and the patterns matter more than the paint.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: a focused product studio, not a marketing shop. If you need a brand and a website, you are paying enterprise rates for the wrong specialty.",
      },
      {
        type: "paragraph",
        text: "Verdict: hire Punchcut over us without hesitation if the job is the agent itself rather than how the company is perceived before the demo.",
      },
      { type: "heading", text: "Character" },
      {
        type: "paragraph",
        text: "Price: $80–250k · Location: San Francisco One of the most recognized brand studios in tech, known for identities that read expensive without reading corporate. Research-first: competitive analysis, customer research, and market positioning all land before any visual work, so the identity rests on strategy rather than taste.",
      },
      {
        type: "paragraph",
        text: "Where it shines: Series B and up, when the brand has to carry a category claim and the budget can absorb a real research phase.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: the floor is $80k and the timeline is 10 to 24 weeks. There is no seed-stage version of Character.",
      },
      {
        type: "paragraph",
        text: "Verdict: hire Character if you have raised a large B and the brand is the bet. They beat us on research depth and visual authority.",
      },
      { type: "heading", text: "Clay" },
      {
        type: "paragraph",
        text: "Price: $50k+ minimum, $150–199/hr, projects reported $10–150k (Clutch) · Location: San Francisco HQ Among the most respected studios in the design community. The work balances brand perception against conversion, so the site looks crafted and still makes people act. Clients include Coinbase, Uber, Amazon, VMware, Cisco, and ADP, plus offices across NY, Austin, Denver, Lisbon, and Belgrade.",
      },
      {
        type: "paragraph",
        text: "Where it shines: growth-stage applied AI with a healthy budget, wanting a site that signals category leadership.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: the $50k minimum rules out pre-Series A, and the enterprise client mix means a 25-person startup is a small account.",
      },
      {
        type: "paragraph",
        text: "Verdict: hire Clay when the product is real, the budget is there, and the site needs to look like the market leader's.",
      },
      { type: "heading", text: "Parallel" },
      {
        type: "paragraph",
        text: "Price: design sprints $12–30k (seed engagements typically $14–20k), growth retainer $6–15k/mo · Location: remote, US and UK focus A design partner built specifically for early-stage AI and B2B SaaS, integrating product strategy, opportunity mapping, and onboarding design into one engagement so strategy and design decisions stay in the same room. They publish more content on this exact query set than anyone, which is how you probably found this page in the first place.",
      },
      {
        type: "paragraph",
        text: "Where it shines: seed and early Series A budgets that still want strategy in the room, and product-led companies where onboarding is the conversion surface.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: the sprint tier is genuinely cheaper than ours, and cheaper buys less: less brand depth, and a practice weighted toward product over the perception problem that stalls enterprise deals. They also rank themselves #1 on their own comparable list, so calibrate their rankings the same way you calibrate ours.",
      },
      {
        type: "paragraph",
        text: "Verdict: the honest cheaper alternative to us. If $25k is out of reach and you need strategy anyway, start here.",
      },
      { type: "heading", text: "Webstacks" },
      {
        type: "paragraph",
        text: "Price: project-based · Location: San Diego, remote-first They treat the website as a product: modular, documentation-driven, and built to scale. Strong on composable and headless architecture as well as Webflow, and specialized in sites juggling multiple product lines, enterprise and SMB audiences side by side, and heavy content. Clients include Gong, Calendly, and ServiceTitan.",
      },
      {
        type: "paragraph",
        text: "Where it shines: Series B and up with a real in-house marketing team and a site that has outgrown a simple builder.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: heavier than an early-stage team needs, and the engagement assumes you have marketers to feed it. This is not the partner for a first brand.",
      },
      {
        type: "paragraph",
        text: "Verdict: the right call once your site is a content operation rather than a set of pages.",
      },
      { type: "heading", text: "Everything Design" },
      {
        type: "paragraph",
        text: "Price: early-stage brand and website packages, 8 to 10 week timeline · Location: Bengaluru An explicit AI-startup practice, with a philosophy that matches the argument of this article: use-case specificity over 'AI-powered,' proof over claims. They have built for clinical AI (Cloudphysician), consumer-insights AI (Entropik), contract AI (SimpliContract), and Peoplebox. In-house motion means the team writing the messaging also visualizes the AI workflow.",
      },
      {
        type: "paragraph",
        text: "Where it shines: pre-launch and seed companies with a finite budget that still need the product made legible.",
      },
      {
        type: "paragraph",
        text: "Where it doesn't: they do not publish pricing, so you cannot self-qualify before a call. And early-stage packages mean early-stage scope: this is not the team for an enterprise-motion repositioning.",
      },
      {
        type: "paragraph",
        text: "Verdict: the value pick at the earliest end, and a genuine alternative to us for founders who cannot reach $25k.",
      },
      { type: "heading", text: "When you should not hire an agency at all" },
      {
        type: "paragraph",
        text: "The honest answer for a real share of the people reading this. If you are pre-PMF, don't. Use a template and Claude Code. A brand amplifies a position, and if the position is still moving you are paying to personify something that will change. Come back after the pivot settles.",
      },
      {
        type: "paragraph",
        text: "If cost is your only reason for switching, a subscription at $699 to $4,995/mo buys production without strategy, and that is the right trade for some teams.",
      },
      {
        type: "paragraph",
        text: "If you have a locked Figma and fixed comps, hire a freelancer at $2–8k. You do not need anyone's opinion and should not pay for one.",
      },
      {
        type: "paragraph",
        text: "If your problem is pipeline volume, hire a growth agency. Design makes every impression land harder. It does not create impressions.",
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
      { type: "heading", text: "How much does a website cost for a B2B AI company?" },
      {
        type: "paragraph",
        text: "Expect $10–25k for an early-stage brand and site, $25–75k for a growth-stage redesign, and $100–250k+ at elite product studios like MetaLab. Framer and Webflow builds tend to land $15–40k. Productized subscriptions run $699–$4,995/mo. Price scales with strategy depth, team seniority, and how much system you keep, more than with page count.",
      },
      { type: "heading", text: "Do we need an AI-specialized agency, or is a generic B2B agency fine?" },
      {
        type: "paragraph",
        text: "You need one that has made a complex, invisible product legible before, whether or not they label themselves AI. The failure mode of a generic B2B agency is a site that looks fine and explains nothing, because nothing in a standard SaaS rebrand teaches you to earn an engineer's trust. Judge by the work, not the label.",
      },
      { type: "heading", text: "Every AI startup website looks the same now. Does it matter?" },
      {
        type: "paragraph",
        text: "It matters at exactly one moment: when an enterprise buyer is comparing you to three alternatives after a demo. Sameness is free when you are the only option and expensive when you are one of four. If a buyer swapped your logo onto a competitor's site and nobody noticed, your design is doing no work in that comparison.",
      },
      { type: "heading", text: "Our website looks like every other AI startup. How do we stand out?" },
      {
        type: "paragraph",
        text: "Start from the opinion you hold about your market that your competitors would not say out loud, then build the brand to argue it. Most AI startup sites are interchangeable because they describe a category instead of taking a position. The fix is not a new gradient, it is deciding what you are against.",
      },
      { type: "heading", text: "How do I make my startup look more credible to enterprise buyers?" },
      {
        type: "paragraph",
        text: "Specificity and coherence. Named customers, real numbers, a claim narrow enough to be falsifiable, and a designed security and compliance surface rather than footer links. Enterprise buyers are not judging whether your product is good, they are judging whether you will exist in three years, and coherence across site, deck, and product is most of the evidence they have before a call.",
      },
      { type: "heading", text: "Webflow, Framer, or custom code for an AI startup site?" },
      {
        type: "paragraph",
        text: "For most seed to Series B AI companies, Framer or Webflow: fast to build, and marketing can update it without a developer. Go custom when the site needs real app logic, gated product experiences, or scale a builder cannot handle. The wrong reason to go custom is that it sounds more serious.",
      },
      { type: "heading", text: "How long should an AI company website take?" },
      {
        type: "paragraph",
        text: "A focused Framer or Webflow marketing site is 2 to 6 weeks from approved design. A full brand plus site is 8 to 10 weeks at most studios, and our sprints run two weeks for brand and three for the site. Elite product studios run 3 to 6 months. Speed is strategic here: AI positioning has a short shelf life, so shipping late means shipping something already stale.",
      },
      { type: "heading", text: "Should branding and website be done together?" },
      {
        type: "paragraph",
        text: "For early-stage AI companies, usually yes. The brand and the site are the same first impression, and splitting them across vendors tends to produce a site whose message and visuals disagree. A combined engagement keeps the story coherent and skips a handoff that costs weeks.",
      },
      { type: "heading", text: "Who designed Midjourney's interface, and who designed Cursor's site?" },
      {
        type: "paragraph",
        text: "MetaLab moved Midjourney off Discord into its own web interface, and also built Suno's brand and interface and Windsurf's brand system. basement.studio has worked with Cursor, along with Scale, Harvey, Baseten, Black Forest Labs, and Replicate. Those two studios account for a striking share of the AI products whose design people actually talk about.",
      },
      { type: "heading", text: "When should a startup hire a design agency vs a freelancer?" },
      {
        type: "paragraph",
        text: "Hire a freelancer when the strategy is locked, the scope is defined, and you need execution at $2–8k. Hire an agency when someone needs to take a position on what the brand should argue, when the work spans brand and site and product, or when you need a system maintained after launch. If you are still deciding what to say, a freelancer will build exactly what you asked for and it will be wrong.",
      },
      { type: "heading", text: "How much should a funded startup invest in brand?" },
      {
        type: "paragraph",
        text: "At Series A going upmarket, budget $25–60k and four to six weeks for brand plus website. Below $2M raised, spend near zero on agencies. At Series B with a category claim to defend, $80k+ at a prestige studio is defensible. The filter is not what you can afford, it is whether your positioning is settled enough to be worth amplifying.",
      },
      { type: "heading", text: "We built our site with Claude Code. Is that hurting us with enterprise buyers?" },
      {
        type: "paragraph",
        text: "Only if it looks like it, and it usually does. The tell is not that it was AI-built, it is that it is generic: the same hero, the same three-column grid, the same gradient as the other companies in your category, because you all prompted the same model. That reads as early-stage to a buyer trying to assess whether you will still exist at renewal.",
      },
      { type: "heading", text: "The bottom line" },
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
    // Placeholder — real content lands later, same shape as the entry above.
    slug: "post-2",
    title: "What makes a website project run smoothly",
    category: "Design",
    image: "/media/blog-banner-bg.png",
    author: "Daksh, PIXELUP LABS",
    publishedDate: "2026-06-21",
    updatedDate: "2026-06-21",
    content: [
      {
        type: "paragraph",
        text: "Content for this article is coming soon.",
      },
    ],
  },
  {
    slug: "post-3",
    title: "What makes a website project run smoothly",
    category: "Design",
    image: "/media/blog-banner-bg.png",
    author: "Daksh, PIXELUP LABS",
    publishedDate: "2026-05-30",
    updatedDate: "2026-05-30",
    content: [
      {
        type: "paragraph",
        text: "Content for this article is coming soon.",
      },
    ],
  },
];

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

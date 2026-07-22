---
tokens: ./tokens/tokens.json
component_contracts: ./components/component-contracts.json
reference_landing_page: ./reference/landing-page.html
reference_landing_page_notes: ./reference/landing-page-notes.md
status: draft — sourced from the live codebase (copy, code, config); validate against the real brand guideline before treating as final
---

# Design System — PixelUp Labs

Source of truth for any agent generating or editing a page in this repo. Read this file, `tokens/tokens.json`, and `components/component-contracts.json` before writing markup. If `reference/landing-page.html` exists, treat it as the canonical example of everything below applied at once.

Everything in this file is sourced directly from real copy, real component code, and real config already in this repository (`lib/case-studies.ts`, `lib/projects.ts`, `app/layout.tsx`, `app/globals.css`, and every component under `/components`) — not invented. Anywhere a claim can't be traced to something real in the codebase, it's marked as inferred and flagged for validation, the same way the rest of this file distinguishes fact from hypothesis.

## 1. Brand Overview

PixelUp Labs is a design agency for startups, positioned against a specific gap: startups with strong technology but a brand/product surface that doesn't yet look credible to the enterprise buyers, investors, and Fortune 500 customers they're trying to close. The one-line mission repeats near-verbatim in three separate places in the codebase (root metadata, the homepage's Organization schema, and the first FAQ answer):

> "We build brands, websites and products that command enterprise trust."

The agency doesn't sell "design" as a deliverable — it sells the removal of a specific business risk: looking like a risky bet instead of a market leader. The homepage sidebar's subheading makes this explicit: *"We position your brand to match your ambition. Enterprise clients see a market leader, not a risky bet."*

Every case study on the site is framed the same way: a startup had real technology and real traction, but something (brand maturity, product clarity, an outdated website) was capping it — and the fix was proof, not decoration.

*Sourced from: `app/layout.tsx` metadata, `app/page.tsx` Organization schema, `lib/case-studies.ts` (`pixelupFaq[0]`), `components/LeftNav.tsx` default subheading.*

## 2. Brand Principles

Not written down anywhere as a manifesto — extracted from what repeats, near word-for-word, across all three case studies. Treat as a working hypothesis to validate against the real brand guideline, not settled doctrine.

- **"We treated this as a ___ problem, not a ___ one."** This exact sentence template appears in all three case studies' first section (`system design problem, not surface polish`; `credibility problem, not a cosmetics one`; `sales enablement problem, not a website redesign`). It's the single most repeated structural device in the entire copy corpus — the brand's core move is *reframing* the client's problem before solving it.
- **Proof over promise.** Every result is a specific, sourced number with a timeframe and often a named investor/client (`$25M Series A at a $180M valuation led by Benchmark`; `26x in 11 months`; `deployed by Fortune 500 companies including Ford, Avery Dennison, and Freshworks`). No case study closes on a vague claim.
- **Systems, not deliverables.** Every engagement description explicitly frames brand + product + website + sales assets as *one system designed together*, never as separate hand-offs.
- **Access over process.** The FAQ answer on "what's it like to work with you" is direct: *"You work directly with the team on Telegram, with fast turnarounds and quick iterations. No account managers, no layers, no surprises."* This is a deliberate contrast against agency-process bloat.
- **Honesty over sales pitch.** *"Book a discovery call and you will leave with a clear recommendation..."*, *"We will review where you are today and tell you honestly what we would change."* — the FAQ answers consistently choose candor over persuasion.

## 3. Audience

No persona or ICP document exists in this repo. What follows is inferred from the case studies actually on the site and should be validated against real audience research.

- The three real case study clients (Greptile, Sainapse, Sully.ai) are all venture-backed AI startups, post-seed/Series A, moving from developer/technical-buyer traction toward enterprise and Fortune 500 buyers (Ford, Freshworks, Avery Dennison; hospital executives for Sully). This suggests the primary reader is a **founder or exec at a funded startup who has good technology but not yet a brand/product surface that matches it.**
- The recurring phrase "enterprise trust" and "command enterprise trust" (not just "look nice") signals the buyer is optimizing for closing enterprise deals and fundraises, not general brand awareness.
- Copy register is founder-to-founder: direct, confident, numbers-forward, no agency-speak ("layers", "surprises", "cosmetics" are named specifically as things to avoid). This points to a technical/product-minded founder as the reader, not a marketing department.
- **Open gap:** no explicit company-size, industry-vertical (beyond "AI/software startups" by example), or geography data exists in the codebase. Don't infer beyond what's above without further input.

## 4. Brand Personality

| Trait | Evidence |
|---|---|
| **Direct** | FAQ answers state limitations plainly ("Rarely", "No account managers, no layers, no surprises") rather than hedging. |
| **Proof-driven** | Every case study result is a specific number + unit + timeframe + often a named source (investor, client), never a bare claim. |
| **Systems-minded** | Copy repeatedly frames brand/product/website/sales as one designed system, and the reframe pattern ("not a ___ problem") shows up in every case study — this is a company that starts by re-diagnosing, not by producing assets. |
| **Understated / restrained** | Visual system is near-monochrome black with a single accent blue, hairline dividers instead of cards or shadows (see §5, §7) — restraint as the design expression of the same directness found in the copy. |
| **Founder-accessible** | "Chat on Telegram" is a first-class CTA, equal footing with "Start Your Project" — not a support-ticket afterthought. |

**Guideline:** any new copy or visual asset should be checkable against this table — if it can't point to a "because" in real client work, it's a guess, not on-brand yet.

## 5. Visual Language

- **Monochrome base + one accent.** `--color-base: #000000` with white/near-white text at varying opacities is the entire canvas. Exactly one saturated color exists as a functional accent: `--color-accent: #004aeb`. There is no gradient, shadow, or multi-color palette anywhere in `app/globals.css`.
- **Hierarchy by opacity, not just size.** The codebase repeatedly steps text importance through opacity on top of size/weight changes: `text-white` (primary), `text-white/70` (secondary nav), `text-white/65` / `text-muted-65` (hero subheadings), `text-white/60` (body/secondary), `text-white/40` (muted), `color.neutral.label-grey` `#999999` (small uppercase labels). This is a real, repeated pattern — treat it as intentional, not incidental.
- **Dividers, not cards.** Structure comes from 0.5px hairline borders (`--color-hairline: rgba(52, 73, 115, 0.45)`) between sections and columns — never a bordered/shadowed card container. There are zero `box-shadow` declarations anywhere in the codebase.
- **Square corners by default; full-round only for tags/circles.** Project card frames are deliberately square (no border-radius). Rounded corners only appear on pills (12px — filter tags, view toggles) and fully-circular elements (social icons, nav arrows). Nothing uses a "medium" rounded-rectangle card radius.
- **Unresolved second blue.** A second blue, `#0658FC`, appears only on the newer `/explorations` and `/blog` pages (active view-toggle button, small square "category tag" markers) and is *not* defined alongside `--color-accent` in `app/globals.css`. This needs a decision: unify into one brand blue, or formalize as an intentional second accent. See `tokens.json` → `color.brand.highlight`.

## 6. Typography

Locked system, defined once in `app/layout.tsx` and `app/globals.css` — treat as source of truth:

| Token | Family | Use |
|---|---|---|
| `font-display` | Inter Display (self-hosted, weights 400/500) | All headings and body copy, applied globally on `<body>` |
| `font-button` | Instrument Sans (weights 500/600) | Button labels only |
| `.tracking-display` | `-0.03667em` | Applied to display headings — -1.1px at the 30px desktop H1, scales proportionally via `em` at smaller sizes |

**Ad hoc size scale** (real `text-[Npx]` values found across every component — not yet a formalized/rationalized scale, see `tokens.json` → `typography.size` for the full list with per-value usage notes): 12, 13, 14, 16, 20, 21, 22, 24, 28, 30, 32, 36, 40, 48, 52, 56, 64px. 17 distinct sizes for a two-font-family system is a lot of unrationalized surface area — a candidate for consolidating into a real named scale (e.g. xs/sm/base/lg/xl...) before it grows further.

**Known outlier to resolve:** `app/explorations/page.tsx` loads **Geist** via `next/font/google` for exactly one heading ("Concepts we Killed"), scoped to that single page only. This is the one place in the codebase that deviates from the locked Inter Display / Instrument Sans system. Per the pattern in the reference format this document is based on: either retire it in favor of `font-display`, or formalize a real reason a third typeface exists on this one page — don't let more one-off fonts accumulate without the same scrutiny.

## 7. Color System

Base neutrals (from `app/globals.css` `@theme`):

- `#000000` — page background (`color.neutral.base`)
- `#ffffff` — primary white (`color.neutral.white`)
- `rgba(255,255,255,0.65)` / `rgba(255,255,255,0.4)` — secondary/muted text on dark
- `#b4b3b3` — body grey
- `#999999` — label grey (small uppercase labels)
- `rgba(242,243,247,0.08)` — translucent dark button fill
- `rgba(52,73,115,0.45)` — hairline divider (blue-grey, distinct from the brand blues below — don't confuse it for a third accent, it's structural, not decorative)

Accent:

- `#004aeb` — the one real, named brand accent (`--color-accent`). Used for primary CTAs and active/selected states.
- `#0658FC` — a second blue used only on `/explorations` and the blog post author box, not defined in `@theme`. **Flag:** close to but distinct from `#004aeb` — resolve whether this is a genuine second accent or drift before it spreads further. See §5 and `tokens.json`.
- `#04112A` (dark navy) — a one-off card-surface fill used once (blog post author info box). Not yet a token. **Flag:** confirm if this is a real reusable "surface" color before it's reused ad hoc elsewhere.

No documentation-chrome or form-field token set exists separately — this is a marketing/portfolio site, not a product UI, so there's nothing to distinguish from marketing colors.

## 8. Motion Principles

Unlike a from-scratch brand, this codebase has real, working motion already — document it rather than inventing new principles:

- **Entrance:** `.fade-up` (defined in `app/globals.css`) — opacity 0→1 + translateY(10px)→0, `cubic-bezier(0.22, 0.61, 0.36, 1)`, 0.7s. Applied to hero copy, CTAs, and project cards, staggered via inline `animation-delay` (list items stagger by index, capped at 800ms so deep lists don't lag forever). Respects `prefers-reduced-motion: reduce` (animation disabled entirely).
- **Continuous marquee:** the "Trusted by" logo strip scrolls via a duplicated-content `translateX(0 → -50%)` loop, 30s linear infinite (`--animate-marquee`).
- **Lightbox (framer-motion):** `/explorations` uses `AnimatePresence` for a click-to-expand image lightbox — backdrop fades in (`opacity 0→1`, 0.2s) with `backdrop-blur-md`, the expanded image fades + scales in (`scale 0.96→1`, 0.2s, `easeOut`). Prev/next navigation and Escape-to-close are wired to the same state.
- **Interaction philosophy (inferred from the above, not written down elsewhere):** motion is short (≤0.7s), used for entrance and state-reveal, never decorative or bouncy — consistent with the restrained visual language in §5.

## 9. Layout Principles

- **One custom breakpoint:** `desk` = 1200px (`75rem`). Tailwind's default `sm/md/lg/xl/2xl` are unused. Mobile-first throughout: unprefixed classes are the base/mobile state, `desk:` overrides apply at 1200px+.
- **Sidebar width formula:** any hero/info sidebar sitting next to content should render at `LeftNav`'s width — `desk:w-[26%] desk:min-w-[340px] desk:max-w-[460px]` — on a page that has the homepage's `p-5` outer shell, or `CaseSidebar`'s adjusted `desk:w-[calc(26%-10.4px)]` (same min/max) on a page without that shell (case studies, explorations-style full-bleed pages). These render the *same effective width*; don't reuse the raw `26%` formula on a shell-less page.
- **Three page-shell patterns:** (1) page-level scroll with `p-5` outer shell + sticky sidebar (homepage, `/explorations`); (2) fixed-height internal-scroll shell, non-sticky sidebar (`/call`); (3) full-bleed, no outer shell, padding applied per-element instead (case studies, `/blog`).
- **Spacing is Tailwind's default 4px scale, used directly** — no custom spacing tokens exist. Common gaps: 24px (`gap-6`, the most frequent section-to-section spacing), 32px (`py-8`, section breathing room), 20px (`gap-5`).
- **The recurring gap+width overflow bug:** when two flex children have explicit percentage widths that already sum to 100% (a 50/50 or 76/24 split), don't also add a flex `gap` between them — it pushes the total past 100% and silently shrinks both. Use `flex-1` (+ `min-w-0`) instead. This exact mistake has been made and fixed three separate times in this codebase (`ArticleFilters`, `MoreProjects`, `ExplorationGallery`) — treat it as a known trap, not a one-off bug.
- **No global max-content-width wrapper exists.** The constraint is always "sidebar formula + `min-w-0 flex-1` for the rest," not a `max-w-[Npx]` container.

## 10. Components

Full contracts (variants/states/tokens/do-nots) live in `components/component-contracts.json` — this is a condensed index. **Check that file before building anything new; if what you need isn't there, it's a component gap, not license to invent an ad hoc one-off.**

- **LeftNav / CaseSidebar** — the two "hero sidebar" patterns (generic hero copy vs. case-study structured data). Never cross-use them.
- **CtaButtons** — the paired "Chat on Telegram" / "Start Your Project" buttons, reused in three places (sidebar, case-study sidebar, footer).
- **ProjectCard / MoreProjects** — homepage and end-of-case-study project cards, square corners, hover-scale media.
- **SectionShell + CaseSection + CaseFaq** — the case-study Q&A pattern (heading left half / content right half + hairline rule). `CaseFaq`'s accordion + its `FAQPage` JSON-LD schema are shared between case studies and `/blog`.
- **ArticleFilters / ExplorationGallery** — the two interactive, page-specific pill/toggle + gallery patterns (`/blog`, `/explorations`).
- **Navbar / MobileMenu / Footer / TrustedStrip / Logo** — global chrome. Note: **Footer is currently disabled site-wide** (both call sites have it commented out behind a "re-enable when ready" TODO) — the component is intact, just not rendered anywhere yet.

## 11. Illustration Rules

There is no illustration system in this codebase — no vector/abstract illustration asset exists anywhere. The closest equivalent is the decorative background: a full-bleed, top-anchored "light-streak" image (`bg-home.png`, `case-bg.png`) that fades to transparent via a `mask-image` gradient, sitting behind the sticky navbar and page content. Treat this as the site's one abstract visual device — not a general illustration system to extend. If a future page needs an illustrative element, match this pattern (a single soft abstract gradient/streak, faded via mask, never a literal icon-of-a-thing) rather than introducing a new illustration style.

## 12. Photography Rules

Real product screenshots and client brand assets are the site's "photography" — every case study is built from actual UI screenshots, mockups (billboards, posters, devices in real-world settings), and brand film stills from the client's own work, always displayed `object-cover` inside a fixed-aspect frame (`aspect-[1160/696]` full-width, `aspect-[576/548]` paired). There is no stock photography, no lifestyle/people photography, and no photography used purely decoratively — every image in a case study is evidence of the actual delivered work.

**Guideline:** new imagery should follow this precedent — real work product, not generic stock, and always inside the established aspect-ratio frames rather than a bespoke crop per page.

## 13. Copywriting (Structural Rules Only)

Structural rules derived from the real copy already in `lib/case-studies.ts`, not new sample copy — a checklist to apply, not lines to reuse verbatim.

- **Headline formula:** `[Client]: [Transformation] in [Timeframe]` — e.g. *"Greptile: YC W24 to $25M Series A in 6 Months"*, *"Sully: From Liability to Deal Closer in 11 Months"*. Every case study headline names a before/after state and attaches a real timeframe.
- **The reframe sentence:** every case study's first section opens with *"We treated this as a ___ problem, not a ___ one"* — name the real problem, explicitly reject the surface-level framing of it. This is the single most load-bearing repeated sentence structure in the entire copy corpus.
- **Description arc (4 paragraphs, consistent across all 3 case studies):** (1) what the client had / what we were brought in to do → (2) the specific gap or stakes that made this urgent → (3) the reframe sentence + systems framing → (4) the outcome, as a specific number + timeframe.
- **A number is never bare.** Every stat pairs a figure with a unit and a timeframe or source (*"$25M Series A at a $180M valuation led by Benchmark"*, not "$25M raised"; *"26x in 11 months"*, not "26x growth"). Bare numbers don't appear anywhere in the real copy.
- **FAQ answers are short, first-person plural, and unhedged.** *"Rarely."* *"No account managers, no layers, no surprises."* Direct answers, not marketing softening.
- **CTAs are imperative and specific**, never generic ("Learn More"): *"CHAT ON TELEGRAM"*, *"START YOUR PROJECT"*, *"Book a discovery call."*

## 14. Things Never To Do

- Don't add box-shadows or card-with-elevation containers — the entire codebase uses flat surfaces + hairline dividers instead, with zero exceptions found.
- Don't introduce a new accent color without resolving the existing `#004aeb` / `#0658FC` conflict first (§5, §7) — don't add a third.
- Don't add a new font family without the same scrutiny as the Geist outlier on `/explorations` (§6) — Inter Display (body/headings) and Instrument Sans (buttons) are the locked system.
- Don't write a case-study-style headline or stat without an attached timeframe/unit — bare claims break the pattern in §13.
- Don't hedge in FAQ-style or CTA copy ("we hope to," "consider," "might") — the real copy is consistently direct and first-person plural.
- Don't reuse `SectionShell` for a full-width section — it hardcodes a 50/50 split matched to the case-study sidebar layout (see `component-contracts.json`).
- Don't add a flex `gap` between percentage-width siblings that already sum to 100% — use `flex-1` (§9).
- Don't invent a new one-off component before checking `components/component-contracts.json` — flag a gap instead.

## 15. Landing Page Generation Rules

This site doesn't currently have a single marketing "landing page" (it's a portfolio/case-study site) — the rules below generalize the patterns that do exist across the homepage, case studies, and `/call`, for generating a new page consistent with them:

1. Open with a hero: `LeftNav` pattern — heading, one-sentence subheading pairing ambition with proof ("market leader, not a risky bet" style), `TrustedStrip`, then `CtaButtons`.
2. If the page tells a client/project story, use the case-study arc from §13: what they had → the real stakes → the reframe sentence → a specific, sourced result.
3. Any FAQ block should reuse `CaseFaq` + the shared `pixelupFaq` content (or a page-appropriate subset) and ship its matching `FAQPage` JSON-LD schema alongside it — don't write new FAQ copy without first checking whether the shared content already covers the question.
4. Keep exactly one accent color visible in a given viewport (§5, §7) — don't combine the two blues or introduce a new one.
5. Every image needs a real `object-cover`/`object-contain` frame (§12) and a decision on `alt` (decorative → `alt=""`, meaningful → real description) and loading priority (exactly one LCP candidate per page — `loading="eager"` + `fetchPriority="high"`, never the deprecated `priority` prop).
6. Close with the paired CTA (`CtaButtons`) and, once re-enabled, `Footer`.

## 16. Assets

Real, already-in-use assets in this repo (not placeholders):

- `public/media/nav-logo.svg`, `public/media/Union.png` — logomark and full wordmark.
- `public/media/bg-home.png`, `public/media/case-bg.png` — the decorative light-streak background images (§11).
- `public/media/Container.svg`, `public/media/Link.png` — small UI icons (CTA arrow, blog card link icon).
- Per-case-study asset folders (`public/media/greptile/`, `public/media/sainapse/`, `public/media/sully/`) — real client screenshots, mockups, and brand film stills, referenced directly by `lib/case-studies.ts`.
- `public/media/explorations/img-1.png` … `img-8.png` — real exploration/concept images for `/explorations`.
- `public/media/blog-slug-header.png` — blog post header image.

**Open question:** no formal icon library exists — icons are hand-drawn inline SVGs per component (arrow, plus/minus, hamburger, X/LinkedIn glyphs), not sourced from a shared icon set. Decide whether to formalize one before the count grows further.

## Known Gaps

- **Two blues** (`#004aeb` vs `#0658FC`) — unresolved, needs a real decision (§5, §7).
- **Ad hoc type scale** (17 sizes) — not yet consolidated into a named scale (§6).
- **Geist font outlier** on `/explorations` — one-page deviation from the locked type system, undecided whether to keep or retire (§6).
- **Brand voice tone document** — this file infers voice/tone entirely from existing copy; there is no separate brand-voice guideline in the repo to cross-check against. Validate everything in §1–§4 and §13 against the real brand guideline before treating it as final.
- **Footer is currently disabled site-wide** — intact but commented out on every page it would normally appear on (§10).
- **No icon library, no dark/light mode variant** (the site is single-theme, dark-only by design), **no error/empty states**, and **no component storybook/preview environment** exist — none of that is covered here because there's nothing in the codebase to source it from.

# Reference Landing Page — Notes

Describes the *why* behind `reference/landing-page.html`'s markup — decisions that aren't obvious just from reading the HTML, so a future agent generating a new page can reproduce the same logic instead of just copying pixels. Sourced directly from the real component code (`app/page.tsx`, `components/LeftNav.tsx`, `components/Showcase.tsx`, `components/ProjectCard.tsx`, `components/TrustedStrip.tsx`, `components/CtaButtons.tsx`, `components/Navbar.tsx`) as of the snapshot in `landing-page.html`. If that file is regenerated from a different/updated homepage, re-check every section below against it.

## Section order

This is a portfolio homepage, not a multi-section marketing page — there are really only two content regions, side by side rather than stacked:

1. **Navbar** (global, every route) — logo, nav links, mobile hamburger.
2. **Hero sidebar** (`LeftNav`) — heading + subheading, then a bottom group pinned to the sidebar's own bottom on desktop: trusted-by logo marquee, then the CTA button pair.
3. **Project showcase** (`Showcase` → `ProjectCard` × 10) — a single vertical stack of full-bleed project cards, in the exact order defined in `lib/projects.ts`. No categorization, filtering, or grouping — it's a flat, ordered list.
4. **Footer** — currently disabled site-wide (commented out at both real call sites). Not present in the live page or in `landing-page.html`.

There's no separate "features," "testimonial," or "pricing" section — the project list itself *is* the proof/credibility section, each card linking either to an internal case study or an external live client site.

## Spacing rhythm in practice

Base unit is Tailwind's default 4px scale, used directly (no custom spacing tokens — see `tokens/tokens.json`). On this page specifically:

- `p-5` (20px) — the outer page-shell inset on all sides.
- `gap-8` (32px) — between the hero sidebar and the project list on mobile, where they stack in one column. Collapses to `gap-0` on desktop, where the vertical hairline divider (`desk:mx-4`, 16px each side) takes over as the visual separator instead of empty space.
- `gap-4` (16px) — within the hero block, between the H1 and the subheading paragraph.
- `gap-5` (20px) — between the trusted-strip block and the CTA button pair, and the outer gap around the sidebar's whole "bottom group."
- `gap-6` (24px) — between project cards. This is the single most common gap value across the whole site, not just this page (see `DESIGN.md` §9).

Nothing here deviates from the standard scale — this page doesn't introduce any one-off spacing values.

## Type hierarchy in practice

Confirms the exact pattern the notes template predicted before this file existed:

- **H1** (`text-[24px]` mobile → `desk:text-[30px]`, `tracking-display`, `font-medium`, 100% white) is paired with **exactly one** 16px subheading (`text-[16px]`, `text-muted-65` — 65% opacity), and nothing else competes with it for attention in the hero. No H2/H3 exists anywhere on this page.
- Below that, everything drops to small/label-scale text: 12px (`text-label-grey`, "Trusted by top YC companies") and 12px again (`font-button`, CTA button labels) — there is a hard jump from the 16px subheading straight to 12px labels, no intermediate body-copy size used on this page.
- Project cards carry **no visible text at all** — titles/labels exist only as `aria-label` on the link wrapper, not as rendered copy. (Flagged as a real SEO/content gap in earlier work on this repo — every other page type has visible headings, this one doesn't.)

## Color usage rules

- **Only `color.brand.accent` (`#004aeb`) appears on this page** — a single use, as the "Start Your Project" button's background. `color.brand.highlight` (`#0658FC`) does not appear here at all; it's exclusive to `/explorations` and the blog post author box (see `DESIGN.md` §5/§7).
- **Hairline dividers appear twice**: the navbar's `border-b`, and the vertical center rule between the sidebar and the project list (desktop only).
- **No section gets a background fill.** Every element sits directly on the page's black base (`color.neutral.base`) except the two CTA buttons themselves (`color.neutral.button-dark` for Telegram, `color.brand.accent` for Start Your Project) and the decorative background-streak image, which fades to fully transparent by 85% down the page via `mask-image` — it never behaves like a "section background," just a top-of-page atmospheric effect.

## Responsive behavior notes

At the `desk` (1200px) breakpoint:

- Layout direction flips: `flex-col` (stacked) below `desk`, `flex-row` (side by side) at and above it.
- The hero sidebar (`LeftNav`) goes from filling a normal-flow column to `position: sticky`, pinned to the viewport (`desk:top-21`, `desk:h-[calc(100vh-6.5rem)]`) so it stays in view while the project list scrolls past it.
- The vertical divider only exists at `desk` — below it, the two stacked blocks just get plain vertical spacing (`gap-8`) instead.
- **Notable reversal, worth flagging explicitly:** the CTA button pair (`CtaButtons`) goes from a **row** on mobile (`flex-row`, two-up side by side) to a **column** on desktop (`desk:flex-col`, stacked). This is the opposite direction from almost everything else on the site (which is column-on-mobile → row-on-desktop) — it's intentional (two short-label buttons read better side by side on a narrow screen, stacked full-width in the taller desktop sidebar), not a bug to "fix" toward consistency.

## Intentional-but-non-obvious layout decisions

- **The `-my-5` divider trick:** the vertical divider's negative vertical margin deliberately extends it past the page shell's own `p-5` padding, so it touches the navbar above and the footer below with zero gap — removing that negative margin would look like a bug fix but would actually break the intended flush alignment.
- **`desk:top-21` sticky offset:** not an arbitrary number — it's the navbar's height (`h-16`, 4rem) plus the page shell's `p-5` top inset (1.25rem) = 5.25rem. If the navbar height or shell padding ever changes, this offset must be recalculated to match, or the sticky sidebar will visibly slide under/away from the navbar on load.
- **Entrance-delay capping at 800ms:** each project card's `fade-up` animation delay is `200ms + index * 120ms`, capped at 800ms — without the cap, a project list longer than ~5 items would make the last cards visibly lag before appearing. This is why cards 6–10 all share the same 800ms delay in `landing-page.html` rather than continuing to increase.
- **First card gets `loading="eager"` + `fetchPriority="high"`**, every other card is lazy — the first project card is treated as this page's LCP (Largest Contentful Paint) element. Don't remove that special-case without understanding why (see the Next.js image-performance work referenced in `DESIGN.md`/`component-contracts.json`).
- **Project cards render zero visible text** (title/label exist only via `aria-label`) — this looks like a missing feature more than a deliberate choice, and was flagged as an open content/SEO gap in prior work on this repo rather than a settled decision. Don't assume it's intentional without checking further.

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## AI Page Generation

Operating instructions for any AI agent generating a website page in this repo. The design system is the source of truth — these rules exist to make sure it's actually followed, not just read.

### Read these first, in this order

1. [`DESIGN.md`](./DESIGN.md) — brand voice, layout logic, component usage rules, do/don't examples.
2. [`tokens/tokens.json`](./tokens/tokens.json) — every color, spacing, radius, typography, and breakpoint value.
3. [`components/component-contracts.json`](./components/component-contracts.json) — every reusable component: variants, states, tokens used, when to use it, what not to do.
4. [`reference/landing-page.html`](./reference/landing-page.html) — the canonical example of all of the above applied at once. ([`reference/landing-page-notes.md`](./reference/landing-page-notes.md) explains the *why* behind it.)

### Rules

- **Never hardcode a color, spacing, radius, or font value.** Always reference the matching token from `tokens.json`. If the value you need doesn't exist there, stop and flag it — don't approximate with the nearest arbitrary value.
- **Never invent a new component if an existing one in `component-contracts.json` can do the job.** If nothing fits, flag it as a **component gap** (name it, describe what's needed, point to the closest existing component) instead of silently building an ad hoc one-off.
- **Match the reference landing page's section rhythm and spacing pattern** unless the page type genuinely requires deviating from it — and if it does, say so explicitly rather than deviating silently.
- **One primary CTA per page.** Never two competing primary actions.
- **Self-check before presenting as final:** does this look like it belongs on the same site as the reference landing page? Flag anything inconsistent instead of shipping it quietly.

### Output

- Save generated pages using this repo's real routing convention — **App Router**: `app/<route-name>/page.tsx` (e.g. `app/blog/page.tsx`, `app/case-studies/[slug]/page.tsx`). This is confirmed from every existing route in the codebase — don't assume a generic path, detect and match what's actually here.
- After generating, briefly report: which existing components were reused, and any token or component gaps hit along the way.

/**
 * Applies the Sanity-side content fixes from the 2026-08-19 refresh audit.
 *
 * The audit's top-3 actions split across two content stores. The Henry Labs
 * funding placeholder and the case-study metadata live in this repo and are
 * already fixed in `lib/case-studies.ts`. The three blog fixes below live in
 * Sanity (`SANITY_BLOG_SOURCE=sanity`), so they need an API write token:
 *
 *   1. agency-vs — FAQ says "Ours starts at $4,000" while the body says
 *      $6,000. Canonical is `from $6k/mo`; proof-bank.md bans quoting $4k.
 *   2. agency-vs — Superside quoted at the pre-2026-08-17 numbers in 5 places
 *      (~$5,000 advertised / $10,000 real / $120,000 annual minimum). The
 *      verified figure is $15,000/mo on a twelve-month term. The "Rates
 *      verified July 2026" line is stamped with the re-verification.
 *   3. best-saas-web-design-agencies + rebrand-before-or-after-fundraise —
 *      10 broken internal links (8 dead blog slugs, 2 links to a 404
 *      `/pricing`). Live slugs get repointed; links to pages that do not
 *      exist are unwrapped and the sentence around them is rewritten so no
 *      dangling "see X" promise is left behind.
 *
 * Every edit asserts on the exact text it expects to find, so if the copy has
 * been edited in the Studio since 2026-08-19 the script aborts instead of
 * writing something wrong. It is idempotent: a second run finds nothing to do.
 *
 * Usage:
 *   node scripts/fix-audit-2026-08-19.mjs --dry-run     # show the diff only
 *   SANITY_API_WRITE_TOKEN=sk... node scripts/fix-audit-2026-08-19.mjs
 *
 * A read token is enough for --dry-run. Writing needs a token with Editor
 * permissions (Sanity project → API → Tokens).
 */
import fs from 'node:fs'
import path from 'node:path'
import {createClient} from '@sanity/client'

const DRY_RUN = process.argv.includes('--dry-run')

/** Minimal .env.local reader — the script runs outside Next's env loading. */
function readEnvFile(file) {
  if (!fs.existsSync(file)) return {}
  return Object.fromEntries(
    fs
      .readFileSync(file, 'utf8')
      .split('\n')
      .filter((line) => line.includes('=') && !line.trimStart().startsWith('#'))
      .map((line) => {
        const i = line.indexOf('=')
        return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, '')]
      }),
  )
}

const fileEnv = readEnvFile(path.join(process.cwd(), '.env.local'))
const env = {...fileEnv, ...process.env}

const token = DRY_RUN
  ? env.SANITY_API_WRITE_TOKEN || env.SANITY_API_READ_TOKEN
  : env.SANITY_API_WRITE_TOKEN

if (!token) {
  console.error(
    DRY_RUN
      ? 'No token found. Set SANITY_API_READ_TOKEN in .env.local (or SANITY_API_WRITE_TOKEN).'
      : 'SANITY_API_WRITE_TOKEN is required to write.\n' +
          'The token in .env.local is read-only (Viewer). Create an Editor token at\n' +
          'sanity.io/manage → project t106usbm → API → Tokens, then re-run:\n' +
          '  SANITY_API_WRITE_TOKEN=sk... node scripts/fix-audit-2026-08-19.mjs',
  )
  process.exit(1)
}

const client = createClient({
  projectId: env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-10-01',
  useCdn: false,
  token,
})

const LIVE = {
  cost: '/blog/what-a-startup-rebrand-and-website-cost',
  agencyVs: '/blog/agency-vs-freelancer-vs-design-subscription-vs-in-house',
  aiStartups: '/blog/best-design-agencies-for-ai-startups',
}

/**
 * Each edit is one of:
 *   {span, find, replace}   — substring swap inside a single span, asserted
 *   {href, from, to}        — repoint a markDef by its dead href
 *   {unlink, dropSpans}     — remove a markDef whose target does not exist,
 *                             plus the spans that only existed to carry it
 */
const PLAN = [
  {
    id: 'blogPost.agency-vs-freelancer-vs-design-subscription-vs-in-house',
    slug: 'agency-vs-freelancer-vs-design-subscription-vs-in-house',
    // Substantive price corrections, so the refresh stamp moves with them.
    setFields: {updatedDate: '2026-08-19'},
    edits: [
      // 1. The $4,000/$6,000 contradiction, in the FAQ answer that answer
      //    engines are most likely to lift verbatim.
      {
        span: '1kk83ed',
        find: 'Superside effectively from $10,000. Ours starts at $4,000 with the same team that ships our sprints.',
        replace: 'Superside from $15,000. Ours starts at $6,000 with the same team that ships our sprints.',
      },
      // 2. Superside, five places.
      {
        span: '1331vcy',
        find: 'The market spans $549 a month to over $10,000.',
        replace: 'The market spans $549 a month to $15,000 and up.',
      },
      {
        span: '1331vcy',
        find: 'Superside advertises from around $5,000, but client reports put real engagements at $10,000 a month scaling past $100,000, on twelve-month commitments with a $120,000 annual minimum.',
        replace:
          'Superside starts at $15,000 a month on a twelve-month commitment, which is $180,000 a year at the floor.',
      },
      {
        span: '4ah88c',
        find: "Parallel's growth tier is $6,000 to $15,000, and Superside effectively starts at $10,000.",
        replace: "Parallel's growth tier is $6,000 to $15,000, and Superside starts at $15,000.",
      },
      {
        span: 'yx2s0n',
        find: "Parallel's growth tier starts at $6,000, Superside effectively starts at $10,000.",
        replace: "Parallel's growth tier starts at $6,000, Superside starts at $15,000.",
      },
      {
        span: '1u0nqg7',
        find: 'and $10,000 a month and up for Superside, which carries twelve-month commitments and a $120,000 annual minimum.',
        replace: 'and $15,000 a month and up for Superside, which carries a twelve-month commitment.',
      },
      // 3. The verification stamp. Only Superside was re-checked, so the line
      //    says exactly that rather than implying every rate was redone.
      {
        span: '8x4x0a',
        find: "Rates verified July 2026 from Upwork's published rate data",
        replace: "Rates verified July 2026, Superside re-verified August 2026, from Upwork's published rate data",
      },
    ],
  },
  {
    id: '6d1e6c2e-0b2e-4467-ae21-99b5f4ce6025',
    slug: 'best-saas-web-design-agencies',
    edits: [
      {href: 'l003', from: '/blog/startup-rebrand-website-cost', to: LIVE.cost},
      {
        href: 'l012',
        from: '/blog/agency-vs-freelancer-vs-subscription-vs-in-house',
        to: LIVE.agencyVs,
      },
      // The anchor text dropped "design" too, so it matched the dead slug
      // rather than the live article's actual title.
      {
        span: 's261',
        find: 'agency vs freelancer vs subscription vs in-house guide',
        replace: 'agency vs freelancer vs design subscription vs in-house guide',
      },
      {href: 'l014', from: '/blog/best-design-agencies-ai-startups', to: LIVE.aiStartups},
      // /blog/enterprise-deals-stall-after-demo has never shipped. Drop the
      // pointer sentence rather than leave "See <unlinked text>."
      {
        span: 's264',
        find: 'but it can confirm every risk a buyer already fears. See ',
        replace: 'but it can confirm every risk a buyer already fears.',
      },
      {unlink: 'l013', dropSpans: ['s265', 's266']},
      // /pricing is a 404 while this page already publishes our price in its
      // comparison tables, so the claim moves inline and the link goes.
      {
        span: 's278',
        find: 'If your problem is the fast upmarket reset, ',
        replace:
          'If your problem is the fast upmarket reset, our price is on this page — $25k–$40k, 2–5 weeks by scope — so you can disqualify us before a call. If another agency here fits the job better, hire them.',
      },
      {unlink: 'l015', dropSpans: ['s279', 's280']},
    ],
  },
  {
    id: 'f4ba6839-fd50-465e-94ac-1bd50db94f81',
    slug: 'rebrand-before-or-after-fundraise',
    edits: [
      // The three prices sit in the sentence immediately before, so the dead
      // /pricing promise can just go.
      {
        span: 's051',
        find: 'Retainer from $6k/mo. Those numbers are on ',
        replace: 'Retainer from $6k/mo.',
      },
      {unlink: 'l005', dropSpans: ['s052', 's053']},
      {href: 'l006', from: '/blog/startup-rebrand-website-cost', to: LIVE.cost},
      {href: 'l007', from: '/blog/startup-rebrand-website-cost', to: LIVE.cost},
      {
        href: 'l008',
        from: '/blog/agency-vs-freelancer-vs-subscription-vs-in-house',
        to: LIVE.agencyVs,
      },
      // Related-reading item pointing at the unshipped article.
      {unlink: 'l009', dropSpans: ['s081', 's082']},
    ],
  },
]

const changes = []
const skipped = []

function applyEdits(doc, edits) {
  const body = JSON.parse(JSON.stringify(doc.body))
  const blockOfSpan = new Map()
  const blockOfDef = new Map()
  for (const block of body) {
    for (const child of block.children || []) blockOfSpan.set(child._key, block)
    for (const def of block.markDefs || []) blockOfDef.set(def._key, block)
  }

  for (const edit of edits) {
    if (edit.span) {
      const block = blockOfSpan.get(edit.span)
      if (!block) throw new Error(`${doc.slug}: span ${edit.span} not found`)
      const span = block.children.find((c) => c._key === edit.span)
      if (!span.text.includes(edit.find)) {
        if (span.text.includes(edit.replace)) {
          skipped.push(`${doc.slug} span ${edit.span}: already applied`)
          continue
        }
        throw new Error(
          `${doc.slug}: span ${edit.span} no longer contains the expected text.\n` +
            `  expected: ${edit.find}\n  actual:   ${span.text}`,
        )
      }
      span.text = span.text.replace(edit.find, edit.replace)
      changes.push(`${doc.slug} [${edit.span}] text → ${edit.replace.slice(0, 70)}…`)
      continue
    }

    if (edit.href) {
      const block = blockOfDef.get(edit.href)
      if (!block) throw new Error(`${doc.slug}: markDef ${edit.href} not found`)
      const def = block.markDefs.find((d) => d._key === edit.href)
      if (def.href === edit.to) {
        skipped.push(`${doc.slug} link ${edit.href}: already applied`)
        continue
      }
      if (def.href !== edit.from) {
        throw new Error(
          `${doc.slug}: markDef ${edit.href} points at ${def.href}, expected ${edit.from}`,
        )
      }
      def.href = edit.to
      changes.push(`${doc.slug} [${edit.href}] ${edit.from} → ${edit.to}`)
      continue
    }

    if (edit.unlink) {
      const block = blockOfDef.get(edit.unlink)
      if (!block) {
        skipped.push(`${doc.slug} unlink ${edit.unlink}: already applied`)
        continue
      }
      block.markDefs = block.markDefs.filter((d) => d._key !== edit.unlink)
      block.children = block.children.filter((c) => !edit.dropSpans.includes(c._key))
      changes.push(
        `${doc.slug} [${block._key}] removed dead link ${edit.unlink} and spans ${edit.dropSpans.join(', ')}`,
      )
    }
  }

  return body
}

const tx = client.transaction()
let patched = 0

for (const target of PLAN) {
  const doc = await client.fetch(
    `*[_id == $id][0]{_id, "slug": slug.current, updatedDate, body}`,
    {id: target.id},
  )
  if (!doc) throw new Error(`Document ${target.id} (${target.slug}) not found`)

  const body = applyEdits(doc, target.edits)
  const fields = {...(target.setFields || {})}
  for (const [key, value] of Object.entries(fields)) {
    if (doc[key] === value) delete fields[key]
    else changes.push(`${doc.slug} ${key}: ${doc[key]} → ${value}`)
  }

  const bodyChanged = JSON.stringify(body) !== JSON.stringify(doc.body)
  if (!bodyChanged && Object.keys(fields).length === 0) continue

  tx.patch(doc._id, (p) => p.set({...(bodyChanged ? {body} : {}), ...fields}))
  patched += 1
}

console.log(changes.length ? `Changes (${changes.length}):` : 'No changes to make.')
for (const line of changes) console.log('  •', line)
if (skipped.length) {
  console.log(`\nAlready applied (${skipped.length}):`)
  for (const line of skipped) console.log('  -', line)
}

if (!patched) {
  console.log('\nNothing to commit.')
  process.exit(0)
}

if (DRY_RUN) {
  console.log(`\n--dry-run: ${patched} document(s) would be patched. Nothing was written.`)
  process.exit(0)
}

await tx.commit({returnDocuments: false})
console.log(`\nCommitted. ${patched} document(s) patched.`)
console.log('Revalidate the affected routes (or redeploy) so the published pages pick this up.')

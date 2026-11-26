import {stegaClean} from '@sanity/client/stega'
import type {PortableTextBlock} from '@portabletext/types'

/** One external page an article links to, for the Sources list. */
export interface BlogSource {
  href: string
  /** "metalab.com" */
  host: string
  /** "/work/midjourney", or "" for a bare domain. */
  path: string
}

const OWN_HOSTS = new Set(['pixeluplabs.com', 'www.pixeluplabs.com'])

/**
 * Every external page the article links to, in reading order, each once.
 * Derived from the body's own link marks, so the list can never drift from
 * what the article actually cites. Internal links and mailto are left out.
 */
export function collectSources(body: PortableTextBlock[]): BlogSource[] {
  const seen = new Set<string>()
  const sources: BlogSource[] = []

  for (const block of body) {
    const markDefs = (block as {markDefs?: unknown}).markDefs
    if (!Array.isArray(markDefs)) continue
    for (const mark of markDefs as Array<{_type?: string; href?: unknown}>) {
      if (mark._type !== 'link' || typeof mark.href !== 'string') continue
      let url: URL
      try {
        url = new URL(stegaClean(mark.href))
      } catch {
        continue // an internal path such as /blog/…
      }
      if (url.protocol !== 'http:' && url.protocol !== 'https:') continue
      if (OWN_HOSTS.has(url.hostname)) continue

      const host = url.hostname.replace(/^www\./, '')
      const path = url.pathname.replace(/\/$/, '')
      const key = `${host}${path}${url.search}`
      if (seen.has(key)) continue
      seen.add(key)
      sources.push({href: url.href, host, path})
    }
  }
  return sources
}

function isHeading(block: PortableTextBlock, style: string): boolean {
  return block._type === 'block' && (block as {style?: string}).style === style
}

/**
 * Where the inline CTA goes: the article is cut in two just before an H2, so
 * the CTA sits between sections and never inside one. Before the third H2
 * when there are enough sections (past the intro and the first full section,
 * while most readers are still on the page); otherwise the article isn't
 * split and the CTA follows it.
 */
export function splitBodyForCta(
  body: PortableTextBlock[],
): [PortableTextBlock[], PortableTextBlock[]] {
  const h2Indexes = body.flatMap((block, index) => (isHeading(block, 'h2') ? [index] : []))
  if (h2Indexes.length < 4) return [body, []]
  const cut = h2Indexes[2]
  return [body.slice(0, cut), body.slice(cut)]
}

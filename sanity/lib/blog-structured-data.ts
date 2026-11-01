import {stegaClean} from '@sanity/client/stega'
import {BASE_URL, blogPostSchema} from './blog-schema'
import type {BlogPostData} from './blog-types'

/** The parts of a Portable Text body the structured data reads, flattened to plain text. */
type BodyNode =
  | {kind: 'heading'; level: 2 | 3; text: string}
  | {kind: 'text'; text: string; listItem: boolean}
  | {kind: 'image'; alt: string}
  | {kind: 'table'; headers: string[]; rows: string[][]}
  | {kind: 'other'}

type Heading = Extract<BodyNode, {kind: 'heading'}>

/** Hero-screenshot entries found at one heading level, keyed by heading index. */
type ListGroup = {level: 2 | 3; parent: number; domains: Map<number, string>}

const FAQ_HEADINGS = new Set(['faq', 'frequently asked questions'])
// "<Name> homepage hero (<domain>), captured <date>": the alt on every list entry's screenshot.
const HERO_ALT = /^.+?\s+homepage hero \(([a-z0-9-]+(?:\.[a-z0-9-]+)+)\)/i
const NUMBERED = /^(\d+)\.\s+/
const NAME_CONNECTORS = new Set(['and', 'the', 'for'])

function plain(value: unknown): string {
  return typeof value === 'string' ? stegaClean(value).replace(/\s+/g, ' ').trim() : ''
}

function strings(value: unknown): string[] {
  return Array.isArray(value) ? value.map(plain) : []
}

function toNode(value: unknown): BodyNode {
  if (!value || typeof value !== 'object') return {kind: 'other'}
  const block = value as Record<string, unknown>
  if (block._type === 'block') {
    const children = Array.isArray(block.children) ? block.children : []
    const text = plain(
      children.map((child) => (typeof child?.text === 'string' ? child.text : '')).join(''),
    )
    if (block.style === 'h2' || block.style === 'h3') {
      return {kind: 'heading', level: block.style === 'h2' ? 2 : 3, text}
    }
    return {kind: 'text', text, listItem: typeof block.listItem === 'string'}
  }
  if (block._type === 'articleImage') return {kind: 'image', alt: plain(block.alt)}
  if (block._type === 'comparisonTable') {
    const rows = Array.isArray(block.rows) ? block.rows : []
    return {
      kind: 'table',
      headers: strings(block.headers),
      rows: rows.map((row) => strings(row?.cells)),
    }
  }
  return {kind: 'other'}
}

function isHeading(node: BodyNode | undefined, level?: 2 | 3): node is Heading {
  return node?.kind === 'heading' && (level === undefined || node.level === level)
}

function endsSentence(text: string) {
  return /[.!?:;…]["'”’)\]]*$/.test(text)
}

/** Bullets that are full sentences read as a paragraph; fragments become "a; b; c." */
function listText(items: string[]) {
  if (items.every((item) => /[.!?]["'”’)\]]*$/.test(item))) return items.join(' ')
  return `${items.map((item) => item.replace(/[.,;]+$/, '')).join('; ')}.`
}

/** A table inside an answer reads row by row: "Header: cell, Header: cell." */
function tableText(headers: string[], rows: string[][]) {
  return rows
    .map((row) =>
      row
        .map((cell, index) => (cell && headers[index] ? `${headers[index]}: ${cell}` : cell))
        .filter(Boolean)
        .join(', '),
    )
    .filter(Boolean)
    .map((row) => (endsSentence(row) ? row : `${row}.`))
    .join(' ')
}

/**
 * The visible answer as one plain-text paragraph. Images carry no answer text, and a
 * "Related: ..." link roll ends the answer. When the FAQ is the post's last section,
 * the closing lines after the final answer have no heading of their own, so that
 * answer keeps only its first paragraph (and any bullets right under it).
 */
function answerText(nodes: BodyNode[], endsPost: boolean) {
  const parts: string[] = []
  let list: string[] = []
  const flush = () => {
    if (list.length) parts.push(listText(list))
    list = []
  }
  for (const node of nodes) {
    if (node.kind === 'table') {
      flush()
      parts.push(tableText(node.headers, node.rows))
    }
    if (node.kind !== 'text' || !node.text) continue
    if (node.text.startsWith('Related:')) break
    if (node.listItem) {
      list.push(node.text)
      continue
    }
    if (endsPost && (parts.length || list.length)) break
    flush()
    parts.push(node.text)
  }
  flush()
  return parts
    .filter(Boolean)
    .reduce((text, part) => (text ? `${endsSentence(text) ? text : `${text}.`} ${part}` : part), '')
}

function faqPage(nodes: BodyNode[], url: string, title: string) {
  const start = nodes.findIndex(
    (node) => isHeading(node, 2) && FAQ_HEADINGS.has(node.text.toLowerCase()),
  )
  if (start === -1) return null
  const next = nodes.findIndex((node, index) => index > start && isHeading(node, 2))
  const end = next === -1 ? nodes.length : next

  const questions: Array<{name: string; text: string}> = []
  for (let index = start + 1; index < end; index += 1) {
    const node = nodes[index]
    if (!isHeading(node, 3) || !node.text) continue
    let stop = index + 1
    while (stop < end && !isHeading(nodes[stop])) stop += 1
    const text = answerText(nodes.slice(index + 1, stop), next === -1 && stop === end)
    if (text) questions.push({name: node.text, text})
  }
  if (!questions.length) return null

  return {
    '@type': 'FAQPage',
    '@id': `${url}#faq`,
    url,
    name: title,
    isPartOf: {'@id': `${BASE_URL}/#website`},
    breadcrumb: {'@id': `${url}#breadcrumb`},
    mainEntity: questions.map(({name, text}) => ({
      '@type': 'Question',
      name,
      acceptedAnswer: {'@type': 'Answer', text},
    })),
  }
}

/** "3. Studio: best for ..." and "PIXELUP LABS (us): ..." both become the studio name. */
function entryName(heading: string) {
  return heading.replace(NUMBERED, '').split(': ')[0].replace(/\s*\(us\)/i, '').trim()
}

/**
 * A heading without a hero screenshot joins a numbered list only when it is numbered
 * too. In an unnumbered list it has to read like a studio name: not a question, and no
 * lowercase words after the first, so notes such as "Studios we cut, and why" stay out.
 */
function readsLikeEntry(heading: string, numbered: boolean) {
  if (heading.endsWith('?')) return false
  if (numbered) return NUMBERED.test(heading)
  const words = entryName(heading).split(' ')
  return (
    words.length <= 5 &&
    words.slice(1).every((word) => !/^[a-z]{3,}$/.test(word) || NAME_CONNECTORS.has(word))
  )
}

/** Our own entry points at the home page's Organization so the two merge. */
function organization(name: string, domain?: string) {
  const host = domain?.toLowerCase()
  if (host?.replace(/^www\./, '') === 'pixeluplabs.com') {
    return {'@type': 'Organization', '@id': `${BASE_URL}/#organization`, name, url: `${BASE_URL}/`}
  }
  return {'@type': 'Organization', name, ...(host ? {url: `https://${host}`} : {})}
}

/**
 * The agencies a list post ranks, in page order. An entry heading (h2 or h3) is one
 * whose next block is a "<Name> homepage hero (<domain>)" screenshot. A numbered list
 * takes every numbered heading in its run (the h3s under the list h2, or the h2s next
 * to the ones found until the first unnumbered h2), so an entry without a screenshot
 * keeps its place, even first or last, and each position is the number on the page.
 * An unnumbered list runs from its start to the last screenshot and counts in order.
 */
function itemList(nodes: BodyNode[], url: string, title: string) {
  const groups = new Map<string, ListGroup>()
  let parent = -1
  nodes.forEach((node, index) => {
    if (!isHeading(node)) return
    const next = nodes[index + 1]
    const hero = next?.kind === 'image' ? HERO_ALT.exec(next.alt) : null
    if (hero) {
      const key = node.level === 2 ? 'h2' : `h3:${parent}`
      const group = groups.get(key) || {level: node.level, parent, domains: new Map()}
      group.domains.set(index, hero[1])
      groups.set(key, group)
    }
    if (node.level === 2) parent = index
  })

  let group: ListGroup | undefined
  for (const candidate of groups.values()) {
    if (!group || candidate.domains.size > group.domains.size) group = candidate
  }
  if (!group || group.domains.size < 3) return null
  const {level, domains, parent: listIndex} = group

  const found = [...domains.keys()]
  const numbered = found.every((index) => NUMBERED.test((nodes[index] as Heading).text))
  let from = level === 3 ? listIndex + 1 : found[0]
  let to = found[found.length - 1]
  if (numbered && level === 3) {
    const next = nodes.findIndex((node, index) => index > listIndex && isHeading(node, 2))
    to = (next === -1 ? nodes.length : next) - 1
  }
  if (numbered && level === 2) {
    const h2s = nodes.flatMap((node, index) => (isHeading(node, 2) ? [index] : []))
    const isNumbered = (at: number) => NUMBERED.test((nodes[h2s[at]] as Heading).text)
    let first = h2s.indexOf(from)
    let last = h2s.indexOf(to)
    while (first > 0 && isNumbered(first - 1)) first -= 1
    while (last < h2s.length - 1 && isNumbered(last + 1)) last += 1
    from = h2s[first]
    to = h2s[last]
  }
  const listHeading = nodes[listIndex]

  const entries: Array<{position: number; name: string; domain?: string}> = []
  for (let index = from; index <= to; index += 1) {
    const node = nodes[index]
    if (!isHeading(node, level)) continue
    const domain = domains.get(index)
    if (!domain && !readsLikeEntry(node.text, numbered)) continue
    const name = entryName(node.text)
    if (!name) continue
    const position = numbered ? Number(NUMBERED.exec(node.text)?.[1]) : entries.length + 1
    entries.push({position, name, domain})
  }

  return {
    '@type': 'ItemList',
    '@id': `${url}#list`,
    name: level === 3 && isHeading(listHeading) && listHeading.text ? listHeading.text : title,
    numberOfItems: entries.length,
    itemListOrder: 'https://schema.org/ItemListOrderAscending',
    itemListElement: entries.map(({position, name, domain}) => ({
      '@type': 'ListItem',
      position,
      name,
      item: organization(name, domain),
    })),
  }
}

/**
 * The post page's one JSON-LD graph: the BlogPosting from blogPostSchema (its
 * `@context` moves up to the graph), a breadcrumb, and, when the body has them, the
 * FAQ and the ranked agency list.
 */
export function blogPostGraph(post: BlogPostData) {
  const {'@context': context, ...article} = blogPostSchema(post)
  const url = article.mainEntityOfPage
  const breadcrumb = {
    '@type': 'BreadcrumbList',
    '@id': `${url}#breadcrumb`,
    itemListElement: [
      {'@type': 'ListItem', position: 1, name: 'Home', item: `${BASE_URL}/`},
      {'@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog`},
      {'@type': 'ListItem', position: 3, name: post.title, item: url},
    ],
  }

  const sections: object[] = []
  try {
    const nodes = Array.isArray(post.body) ? post.body.map(toNode) : []
    for (const section of [faqPage(nodes, url, post.title), itemList(nodes, url, post.title)]) {
      if (section) sections.push(section)
    }
  } catch {
    // A body we cannot read only costs the optional nodes, never the page.
  }

  return {'@context': context, '@graph': [article, breadcrumb, ...sections]}
}

/** JSON for an inline ld+json script; `<` is escaped so no text can close the tag. */
export function serializeJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c')
}

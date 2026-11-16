import type {PortableTextBlock} from '@portabletext/types'

/** "2026-07-07" -> "JUL 7, 2026" */
export function formatBlogDate(date: string): string {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
    .toUpperCase()
}

/** Every category the posts carry, most-used first (ties alphabetical), so a
    category added in Sanity becomes a /blog filter without a code change. */
export function blogCategories(posts: {categories: string[]}[]): string[] {
  const counts = new Map<string, number>()
  for (const post of posts) {
    for (const category of post.categories) counts.set(category, (counts.get(category) || 0) + 1)
  }
  return [...counts]
    .sort(([a, countA], [b, countB]) => countB - countA || a.localeCompare(b))
    .map(([category]) => category)
}

function collectStrings(value: unknown): string[] {
  if (typeof value === 'string') return [value]
  if (Array.isArray(value)) return value.flatMap(collectStrings)
  if (value && typeof value === 'object') {
    return Object.entries(value)
      .filter(([key]) => !key.startsWith('_'))
      .flatMap(([, child]) => collectStrings(child))
  }
  return []
}

/** Rough reading time from Portable Text content at 200wpm. */
export function estimateReadTime(body: PortableTextBlock[]): string {
  // Image alt text and captions aren't reading time.
  const wordCount = collectStrings(body.filter((block) => block._type !== 'articleImage'))
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  return `${Math.max(1, Math.round(wordCount / 200))} MIN READ`
}

import type {PortableTextBlock} from '@portabletext/types'

/** "2026-07-07" -> "JUL 7, 2026" */
export function formatBlogDate(date: string): string {
  return new Date(`${date}T00:00:00`)
    .toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})
    .toUpperCase()
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
  const wordCount = collectStrings(body)
    .join(' ')
    .split(/\s+/)
    .filter(Boolean).length
  return `${Math.max(1, Math.round(wordCount / 200))} MIN READ`
}

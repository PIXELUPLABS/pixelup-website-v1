/**
 * Public profile URLs for post authors, keyed by the author's name as it
 * appears before the comma in the "Written by" string ("Daksh Aswal, Founder at
 * PIXELUP LABS" -> "Daksh Aswal"). Kept local so the blog detail page can link
 * the byline without a Sanity schema change. Keep the old first-name key so a
 * rename in Sanity never drops the link.
 */
const AUTHOR_PROFILE_URLS: Record<string, string> = {
  'Daksh Aswal': 'https://www.linkedin.com/in/dakshpixelup/',
  Daksh: 'https://www.linkedin.com/in/dakshpixelup/',
}

export function authorName(author: string): string {
  const commaIndex = author.indexOf(',')
  return commaIndex === -1 ? author.trim() : author.slice(0, commaIndex).trim()
}

/** Lookup key: the name as written, else its first word. */
function lookup<T>(table: Record<string, T>, author: string): T | undefined {
  const name = authorName(author)
  return table[name] ?? table[name.split(/\s+/)[0]]
}

export function authorProfileUrl(author: string): string | undefined {
  return lookup(AUTHOR_PROFILE_URLS, author)
}

export interface AuthorProfile {
  fullName: string
  /** Under public/. */
  avatar: string
  bio: string
  /** Icon links under the bio, in display order. */
  socials: {name: 'LinkedIn' | 'X'; href: string}[]
}

/** End-of-article author box content, keyed by first name. */
const AUTHOR_PROFILES: Record<string, AuthorProfile> = {
  Daksh: {
    fullName: 'Daksh Aswal',
    avatar: '/media/daksh-avatar.jpg',
    bio: 'Daksh founded PIXELUP LABS, the enterprise-readiness design partner for B2B startups, and leads brand and website work for funded B2B and AI companies such as Greptile, Sully and Henry Labs.',
    socials: [
      {name: 'LinkedIn', href: 'https://www.linkedin.com/in/dakshpixelup/'},
      {name: 'X', href: 'https://x.com/dakshpixelup'},
    ],
  },
}

export function authorProfile(author: string): AuthorProfile | undefined {
  return lookup(AUTHOR_PROFILES, author)
}

/** "Daksh Aswal, Founder at PIXELUP LABS" -> "Founder at PIXELUP LABS". */
export function authorRole(author: string): string | undefined {
  const commaIndex = author.indexOf(',')
  return commaIndex === -1 ? undefined : author.slice(commaIndex + 1).trim() || undefined
}

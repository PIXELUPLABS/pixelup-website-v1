import 'server-only'
import {stegaClean} from '@sanity/client/stega'
import type {
  BLOG_POST_QUERY_RESULT,
  BLOG_POSTS_QUERY_RESULT,
  BLOG_SITEMAP_QUERY_RESULT,
  BLOG_SLUGS_QUERY_RESULT,
} from '@/sanity.types'
import {sanityFetch} from './live'
import {getLegacyBlogPosts} from './legacy-blog'
import {BLOG_POST_QUERY, BLOG_POSTS_QUERY, BLOG_SITEMAP_QUERY, BLOG_SLUGS_QUERY} from './queries'
import type {BlogImage, BlogPostData, BlogSitemapEntry} from './blog-types'

type SanityPost = BLOG_POSTS_QUERY_RESULT[number] | NonNullable<BLOG_POST_QUERY_RESULT>
type SanityImageValue = SanityPost['mainImage']

export const isSanityBlogEnabled = process.env.SANITY_BLOG_SOURCE === 'sanity'

if (isSanityBlogEnabled && !process.env.SANITY_API_READ_TOKEN) {
  throw new Error('SANITY_API_READ_TOKEN is required while SANITY_BLOG_SOURCE=sanity.')
}

function normalizeImage(value: SanityImageValue | null | undefined): BlogImage | undefined {
  if (!value?.asset?._id) return undefined
  return {
    kind: 'sanity',
    source: value,
    alt: value.alt || '',
    lqip: value.asset.metadata?.lqip || undefined,
    width: value.asset.metadata?.dimensions?.width,
    height: value.asset.metadata?.dimensions?.height,
  }
}

function normalizePost(post: SanityPost): BlogPostData | null {
  const image = normalizeImage(post.mainImage)
  if (
    !post._id ||
    !post.slug ||
    !post.title ||
    !post.description ||
    !post.publishedDate ||
    !post.updatedDate ||
    !image
  ) {
    return null
  }

  const authorName = post.author?.name || 'PIXELUP LABS'
  const author = post.author?.role ? `${authorName}, ${post.author.role}` : authorName
  const seoImage = normalizeImage(post.seo?.image)

  return {
    id: post._id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    categories: (post.categories || []).flatMap((category) =>
      category?.title ? [category.title] : [],
    ),
    image,
    author,
    publishedDate: post.publishedDate,
    updatedDate: post.updatedDate,
    body: ('body' in post ? post.body : []) as BlogPostData['body'],
    seo: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.description,
      noIndex: post.seo?.noIndex === true,
      ...(seoImage ? {image: seoImage} : {}),
    },
  }
}

function legacyPosts() {
  return getLegacyBlogPosts()
}

export async function getBlogPosts(options: {stega?: boolean} = {}): Promise<BlogPostData[]> {
  if (!isSanityBlogEnabled) return legacyPosts()
  const {data} = await sanityFetch({query: BLOG_POSTS_QUERY, stega: options.stega})
  return data.flatMap((post) => {
    const normalized = normalizePost(post)
    return normalized ? [normalized] : []
  })
}

export async function getBlogPost(
  slug: string,
  options: {stega?: boolean} = {},
): Promise<BlogPostData | null> {
  const cleanSlug = stegaClean(slug)
  if (!isSanityBlogEnabled) {
    return legacyPosts().find((post) => post.slug === cleanSlug) || null
  }
  const {data} = await sanityFetch({
    query: BLOG_POST_QUERY,
    params: {slug: cleanSlug},
    stega: options.stega,
  })
  return data ? normalizePost(data) : null
}

export async function getBlogSlugs(): Promise<string[]> {
  if (!isSanityBlogEnabled) return legacyPosts().map((post) => post.slug)
  const {data} = await sanityFetch({
    query: BLOG_SLUGS_QUERY,
    perspective: 'published',
    stega: false,
  })
  return (data as BLOG_SLUGS_QUERY_RESULT).map((entry) => entry.slug)
}

export async function getBlogSitemapEntries(): Promise<BlogSitemapEntry[]> {
  if (!isSanityBlogEnabled) {
    return legacyPosts().map(({slug, updatedDate}) => ({slug, updatedDate}))
  }
  const {data} = await sanityFetch({
    query: BLOG_SITEMAP_QUERY,
    perspective: 'published',
    stega: false,
  })
  return (data as BLOG_SITEMAP_QUERY_RESULT).map(({slug, updatedDate}) => ({slug, updatedDate}))
}

export function getBlogIndexUpdated(posts: BlogSitemapEntry[]): string {
  return posts.reduce(
    (latest, post) => (post.updatedDate > latest ? post.updatedDate : latest),
    '',
  )
}

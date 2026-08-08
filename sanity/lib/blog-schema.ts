import {urlFor} from './image'
import type {BlogImage, BlogPostData} from './blog-types'

const BASE_URL = 'https://www.pixeluplabs.com'

export function blogImageUrl(image: BlogImage, width = 2084, height = 960): string {
  if (image.kind === 'legacy') return `${BASE_URL}${image.src}`
  return urlFor(image.source).width(width).height(height).fit('crop').auto('format').url()
}

export function blogPostSchema(post: BlogPostData) {
  const commaIndex = post.author.indexOf(',')
  const authorName =
    commaIndex === -1 ? post.author : post.author.slice(0, commaIndex).trim()
  const authorTitle =
    commaIndex === -1 ? undefined : post.author.slice(commaIndex + 1).trim()

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${BASE_URL}/blog/${post.slug}#article`,
    mainEntityOfPage: `${BASE_URL}/blog/${post.slug}`,
    headline: post.title,
    description: post.seo.description,
    image: blogImageUrl(post.seo.image || post.image),
    articleSection: post.categories,
    datePublished: post.publishedDate,
    dateModified: post.updatedDate,
    author: {
      '@type': 'Person',
      name: authorName,
      ...(authorTitle ? {jobTitle: authorTitle} : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: 'PIXELUP LABS',
      url: `${BASE_URL}/`,
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/media/nav-logo.svg`,
      },
    },
  }
}

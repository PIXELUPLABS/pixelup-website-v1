import 'server-only'
import {blogPosts as legacyPosts} from '@/lib/blog'
import type {BlogPostData} from './blog-types'
import {legacyContentToPortableText} from './portable-text'

export function getLegacyBlogPosts(): BlogPostData[] {
  return legacyPosts.map((post) => ({
    id: `legacy:${post.slug}`,
    slug: post.slug,
    title: post.title,
    description: post.description,
    categories: post.categories,
    image: {kind: 'legacy', src: post.image, alt: ''},
    author: post.author,
    publishedDate: post.publishedDate,
    updatedDate: post.updatedDate,
    body: legacyContentToPortableText(post.content, post.slug),
    seo: {
      title: post.title,
      description: post.description,
      noIndex: false,
    },
  }))
}

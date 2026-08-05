import type {PortableTextBlock} from '@portabletext/types'
import type {SanityImageSource} from '@sanity/image-url'

export type BlogImage =
  | {kind: 'legacy'; src: string; alt: string}
  | {
      kind: 'sanity'
      source: SanityImageSource
      alt: string
      lqip?: string
      width?: number
      height?: number
    }

export interface BlogPostData {
  id: string
  slug: string
  title: string
  description: string
  categories: string[]
  image: BlogImage
  author: string
  publishedDate: string
  updatedDate: string
  body: PortableTextBlock[]
  seo: {
    title: string
    description: string
    noIndex: boolean
    image?: BlogImage
  }
}

export interface BlogSitemapEntry {
  slug: string
  updatedDate: string
}

'use client'

import Image, {type ImageLoaderProps} from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import type {BlogImage as BlogImageValue} from '@/sanity/lib/blog-types'

// Client component because the Sanity loader below is a function prop, which a
// Server Component can't pass to next/image. BlogList already renders it on the
// client, so nothing here depends on the server.

export function BlogImage({
  image,
  alt,
  fill = false,
  width = 2084,
  height = 960,
  sizes,
  priority = false,
  className,
}: {
  image: BlogImageValue
  alt?: string
  fill?: boolean
  width?: number
  height?: number
  sizes: string
  priority?: boolean
  className?: string
}) {
  const imageAlt = alt ?? image.alt

  if (image.kind === 'legacy') {
    return (
      <Image
        src={image.src}
        alt={imageAlt}
        {...(fill ? {fill: true} : {width, height})}
        sizes={sizes}
        priority={priority}
        className={className}
      />
    )
  }

  const base = urlFor(image.source).fit('crop').auto('format')
  const ratio = height / width

  // Sanity's image CDN resizes and picks the format (auto=format), so each
  // srcset width is requested from cdn.sanity.io directly instead of going
  // through Vercel's /_next/image optimizer, which counts against the Vercel
  // plan's image-transformation quota. The crop keeps the width:height ratio.
  const sanityLoader = ({width: w, quality}: ImageLoaderProps) =>
    base
      .width(w)
      .height(Math.round(w * ratio))
      .quality(quality ?? 75)
      .url()

  return (
    <Image
      loader={sanityLoader}
      src={base.width(width).height(height).url()}
      alt={imageAlt}
      {...(fill ? {fill: true} : {width, height})}
      sizes={sizes}
      priority={priority}
      placeholder={image.lqip ? 'blur' : 'empty'}
      blurDataURL={image.lqip}
      className={className}
    />
  )
}

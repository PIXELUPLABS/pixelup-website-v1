import Image from 'next/image'
import {urlFor} from '@/sanity/lib/image'
import type {BlogImage as BlogImageValue} from '@/sanity/lib/blog-types'

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

  const source = urlFor(image.source)
    .width(width)
    .height(height)
    .fit('crop')
    .auto('format')
    .url()

  return (
    <Image
      src={source}
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

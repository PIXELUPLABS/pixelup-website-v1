import {defineQuery} from 'next-sanity'

const blogImageProjection = /* groq */ `{
  asset->{
    _id,
    url,
    metadata{
      lqip,
      dimensions{width, height}
    }
  },
  alt,
  crop,
  hotspot
}`

const blogCardProjection = /* groq */ `
  _id,
  title,
  "slug": slug.current,
  description,
  publishedDate,
  updatedDate,
  "author": author->{name, role},
  "categories": categories[]->{title, "slug": slug.current},
  "mainImage": mainImage${blogImageProjection},
  "seo": {
    "title": coalesce(seo.title, title, ""),
    "description": coalesce(seo.description, description, ""),
    "noIndex": seo.noIndex == true,
    "image": seo.image${blogImageProjection}
  }
`

export const BLOG_POSTS_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && defined(slug.current)]
  | order(publishedDate desc, _id asc){
    ${blogCardProjection}
  }
`)

export const BLOG_POST_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && slug.current == $slug][0]{
    ${blogCardProjection},
    body[]{
      ...,
      _type == "comparisonTable" => {
        _key,
        _type,
        headers,
        rows[]{_key, _type, cells}
      }
    }
  }
`)

export const BLOG_SLUGS_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && defined(slug.current)]{"slug": slug.current}
`)

export const BLOG_SITEMAP_QUERY = defineQuery(/* groq */ `
  *[_type == "blogPost" && defined(slug.current) && seo.noIndex != true]
  | order(publishedDate desc){
    "slug": slug.current,
    "updatedDate": coalesce(updatedDate, _updatedAt)
  }
`)

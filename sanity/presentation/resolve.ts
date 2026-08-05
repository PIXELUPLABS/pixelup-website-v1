import {defineLocations, type PresentationPluginOptions} from 'sanity/presentation'

export const resolve: PresentationPluginOptions['resolve'] = {
  locations: {
    blogPost: defineLocations({
      select: {title: 'title', slug: 'slug.current'},
      resolve: (document) => ({
        locations: [
          {
            title: document?.title || 'Untitled blog post',
            href: document?.slug ? `/blog/${document.slug}` : '/blog',
          },
          {title: 'Blog index', href: '/blog'},
        ],
      }),
    }),
  },
}

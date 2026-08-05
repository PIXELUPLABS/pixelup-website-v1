import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'Search and social',
  type: 'object',
  icon: SearchIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title override',
      type: 'string',
      description: 'Leave empty to use the blog-post title.',
      validation: (rule) => rule.max(70).warning('Search results may truncate titles over 70 characters.'),
    }),
    defineField({
      name: 'description',
      title: 'SEO description override',
      type: 'text',
      rows: 3,
      description: 'Leave empty to use the summary.',
      validation: (rule) => rule.max(170).warning('Search results may truncate descriptions over 170 characters.'),
    }),
    defineField({
      name: 'image',
      title: 'Social sharing image',
      type: 'image',
      description: 'Optional. Falls back to the article image.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
        }),
      ],
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})

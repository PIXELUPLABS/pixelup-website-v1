import {DocumentTextIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'seo', title: 'Search and social'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL slug',
      type: 'slug',
      group: 'content',
      options: {source: 'title', maxLength: 96},
      validation: (rule) =>
        rule.required().custom((value) => {
          if (!value?.current) return true
          return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value.current)
            ? true
            : 'Use lowercase letters, numbers, and single hyphens only.'
        }),
    }),
    defineField({
      name: 'description',
      title: 'Summary',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Used on related cards and as the default search description.',
      validation: (rule) =>
        rule.required().max(170).warning('Search results may truncate summaries over 170 characters.'),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{type: 'author'}],
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'content',
      of: [defineArrayMember({type: 'reference', to: [{type: 'category'}]})],
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Article image',
      type: 'image',
      group: 'content',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alternative text',
          type: 'string',
          description: 'Describe meaningful imagery; leave empty only when the image is decorative.',
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedDate',
      title: 'Published date',
      type: 'date',
      group: 'content',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'updatedDate',
      title: 'Updated date',
      type: 'date',
      group: 'content',
      validation: (rule) =>
        rule.required().custom((value, context) => {
          const publishedDate = context.document?.publishedDate
          if (typeof value === 'string' && typeof publishedDate === 'string' && value < publishedDate) {
            return 'Updated date cannot be earlier than the published date.'
          }
          return true
        }),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blogBody',
      group: 'content',
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'seo',
      title: 'Search and social',
      type: 'seo',
      group: 'seo',
    }),
    defineField({
      name: 'sourceId',
      title: 'Migration source ID',
      type: 'string',
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
  ],
  orderings: [
    {
      title: 'Published date, newest first',
      name: 'publishedDateDesc',
      by: [{field: 'publishedDate', direction: 'desc'}],
    },
  ],
  preview: {
    select: {title: 'title', date: 'publishedDate', media: 'mainImage', author: 'author.name'},
    prepare: ({title, date, media, author}) => ({
      title,
      subtitle: [date, author].filter(Boolean).join(' · '),
      media,
    }),
  },
})

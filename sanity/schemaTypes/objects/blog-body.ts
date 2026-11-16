import {BlockContentIcon, ImageIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

export const blogBody = defineType({
  name: 'blogBody',
  title: 'Article body',
  type: 'array',
  icon: BlockContentIcon,
  of: [
    defineArrayMember({
      type: 'block',
      styles: [
        {title: 'Paragraph', value: 'normal'},
        {title: 'Section heading', value: 'h2'},
        {title: 'Subheading', value: 'h3'},
      ],
      lists: [
        {title: 'Bulleted list', value: 'bullet'},
        {title: 'Numbered list', value: 'number'},
      ],
      marks: {
        decorators: [
          {title: 'Strong', value: 'strong'},
          {title: 'Emphasis', value: 'em'},
        ],
        annotations: [
          defineField({
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              defineField({
                name: 'href',
                title: 'Destination',
                type: 'string',
                validation: (rule) =>
                  rule.required().custom((value) => {
                    if (!value) return true
                    if (value.startsWith('/')) return true
                    try {
                      const url = new URL(value)
                      return ['http:', 'https:', 'mailto:'].includes(url.protocol)
                        ? true
                        : 'Use an internal path, web URL, or mailto link.'
                    } catch {
                      return 'Use an internal path such as /blog or a complete URL.'
                    }
                  }),
              }),
              defineField({
                name: 'openInNewTab',
                title: 'Open in a new tab',
                type: 'boolean',
                initialValue: true,
              }),
            ],
          }),
        ],
      },
    }),
    defineArrayMember({type: 'comparisonTable'}),
    defineArrayMember({
      name: 'articleImage',
      title: 'Image',
      type: 'image',
      icon: ImageIcon,
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'What the image shows, for screen readers and search.',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'caption',
          title: 'Caption',
          type: 'string',
        }),
        defineField({
          name: 'sourceUrl',
          title: 'Source URL',
          type: 'url',
          description: 'For screenshots: the page that was captured. Shown as a link after the caption.',
        }),
        defineField({
          name: 'capturedOn',
          title: 'Captured on',
          type: 'date',
          description: 'For screenshots of third-party sites: the day the screenshot was taken.',
        }),
      ],
      preview: {
        select: {title: 'caption', subtitle: 'alt', media: 'asset'},
      },
    }),
  ],
})

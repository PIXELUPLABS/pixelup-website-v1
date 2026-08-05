import {BlockContentIcon} from '@sanity/icons'
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
  ],
})

import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const author = defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      description: 'Shown after the author name, for example “Founder at PIXELUP LABS”.',
    }),
    defineField({
      name: 'sourceId',
      title: 'Migration source ID',
      type: 'string',
      readOnly: true,
      hidden: ({value}) => value === undefined,
    }),
  ],
  preview: {
    select: {title: 'name', subtitle: 'role'},
  },
})

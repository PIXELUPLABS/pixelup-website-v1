import {defineConfig} from 'sanity'
import {presentationTool} from 'sanity/presentation'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {dataset, projectId} from './sanity/env'
import {resolve} from './sanity/presentation/resolve'
import {schema} from './sanity/schemaTypes'
import {structure} from './sanity/structure'

export default defineConfig({
  name: 'pixelup-blog',
  title: 'PIXELUP LABS Blog',
  projectId,
  dataset,
  plugins: [
    structureTool({structure}),
    presentationTool({
      resolve,
      previewUrl: {
        origin: process.env.SANITY_STUDIO_PREVIEW_ORIGIN || 'http://localhost:3000',
        previewMode: {enable: '/api/draft-mode/enable'},
      },
    }),
    visionTool({defaultApiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-08-05'}),
  ],
  schema,
})

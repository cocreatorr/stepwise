import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { markdownSchema } from 'sanity-plugin-markdown'

// ✅ Import all schemas from schemas/index.ts
import { schemaTypes } from './schemas'

export default defineConfig({
  name: 'default',
  title: 'Stepwise Studio',

  projectId: 'mejutefa',
  dataset: 'production',
  apiVersion: '2022-06-01', // pin API version

  plugins: [
    deskTool(),
    visionTool(),
    markdownSchema(),
  ],

  schema: {
    types: schemaTypes, // ✅ includes post, author, category, settings, blockContent
  },
})

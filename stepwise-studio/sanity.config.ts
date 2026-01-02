import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'  // <-- index.ts is auto-resolved

const projectId = 'mejutefa'
const dataset = 'production'

export default defineConfig({
  name: 'default',
  title: 'Stepwise Studio',

  projectId,
  dataset,

  plugins: [
    deskTool(),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
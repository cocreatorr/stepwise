import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'  // <-- your schema definitions

// Pull values from environment variables
const projectId = process.env.SANITY_PROJECT_ID!
const dataset = process.env.SANITY_DATASET!

export default defineConfig({
  name: 'default',
  title: 'Stepwise Studio',

  projectId,
  dataset,

  // Plugins: Desk, Structure, Vision
  plugins: [
    deskTool(),
    structureTool(),   // optional: customize Desk structure
    visionTool(),      // optional: GROQ query playground
  ],

  // Schema definitions
  schema: {
    types: schemaTypes,
  },
})

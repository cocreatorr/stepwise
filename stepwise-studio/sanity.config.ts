import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'  // <-- index.ts is auto-resolved
import { markdownSchema } from 'sanity-plugin-markdown'
import post from './schemas/post'
import category from './schemas/category'
import author from './schemas/author'

const projectId = 'mejutefa';
const dataset = 'production';

export default defineConfig({
  name: 'default',
  title: 'Stepwise Studio',

  projectId: "mejutefa",
  dataset: "production",

  plugins: [
    deskTool(),
    visionTool(),
    markdownSchema(), // enables Markdown editor ],
  ],

  schema: {
    types: [post, category, author],
  },
})
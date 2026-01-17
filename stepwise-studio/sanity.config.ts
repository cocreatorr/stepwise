import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { markdownSchema } from 'sanity-plugin-markdown'
import post from './schemas/post'
import category from './schemas/category'
import author from './schemas/author'

export default defineConfig({
  name: 'default',
  title: 'Stepwise Studio',

  projectId: 'mejutefa',
  dataset: 'production',
  apiVersion: '2022-06-01',   // 👈 pin API version here

  plugins: [
    deskTool(),
    visionTool(),
    markdownSchema(),
  ],

  schema: {
    types: [post, category, author],
  },
})

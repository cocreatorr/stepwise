import { createClient } from '@sanity/client'

export const sanityServerClient = createClient({
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET!,
  apiVersion: '2023-01-01', // use a fixed date
  useCdn: false,            // disable CDN for fresh data
  token: process.env.SANITY_API_TOKEN!, // private token
})


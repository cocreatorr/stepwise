// /schemas/index.ts
import post from './post'
import author from './author'
import category from './category'
import settings from './settings'

// Collect all schema definitions into one array
export const schemaTypes = [
  post,
  author,
  category,
  settings,
]

// stepwise-studio/schemaTypes.ts

// Import all your schema definitions from the /schemas folder
import post from './schemas/post'
import author from './schemas/author'
import category from './schemas/category'

// Collect them into a single array
export const schemaTypes = [
  post,
  author,
  category,
]


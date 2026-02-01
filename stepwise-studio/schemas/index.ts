// Import all individual schema definitions
import post from './post'
import author from './author'
import category from './category'
import tag from './tag'          // ✅ Tag schema now included
import settings from './settings'
import blockContent from './blockContent'

// Export them as a single array for Sanity Studio
export const schemaTypes = [
  post,
  author,
  category,
  tag,          // ✅ Register Tag schema so references resolve
  settings,     // ✅ Site Settings schema included
  blockContent,
]

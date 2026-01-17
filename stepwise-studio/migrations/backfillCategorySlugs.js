// migrations/backfillCategorySlugs.js
import { defineMigration } from "sanity/migrate"
import slugify from "slugify"

export default defineMigration({
  title: "Force backfill slugs for categories",
  async migrate({ client }) {
    const customClient = client.withConfig({ apiVersion: "2022-06-01" })
    console.log("🚀 Migration started...")

    // Fetch ALL categories (published + drafts)
    const categories = await customClient.fetch(
      `*[_id match "drafts.*" || _type == "category"]{_id, title, slug}`
    )

    if (categories.length > 0) {
      const seen = new Set()
      for (const cat of categories) {
        if (!cat.title) continue // skip empty drafts

        let newSlug = slugify(cat.title, { lower: true, strict: true, trim: true })

        // Ensure uniqueness if multiple categories have same title
        if (seen.has(newSlug)) {
          newSlug = `${newSlug}-${cat._id.slice(0, 6)}`
        }
        seen.add(newSlug)

        // Force overwrite if slug is missing OR null
        if (!cat.slug || !cat.slug.current) {
          console.log(`🔧 Writing slug "${newSlug}" for category "${cat.title}" (${cat._id})`)
          await customClient
            .patch(cat._id)
            .set({ slug: { _type: "slug", current: newSlug } }) // overwrite null
            .commit()
        }
      }
      console.log(`✅ Backfilled slugs for ${categories.length} categories`)
    } else {
      console.log("✅ No categories found.")
    }

    console.log("Migration finished ✅")
  },
})

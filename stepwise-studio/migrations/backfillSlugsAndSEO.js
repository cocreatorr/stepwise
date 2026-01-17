// migrations/backfillCategorySlugs.js
import { defineMigration } from "sanity/migrate"
import slugify from "slugify"

export default defineMigration({
  title: "Force overwrite slugs for categories",
  async migrate({ client }) {
    const customClient = client.withConfig({ apiVersion: "2022-06-01" })
    console.log("🚀 Migration started...")

    const categories = await customClient.fetch(
      `*[_id match "drafts.*" || _type == "category"]{_id, title}`
    )

    for (const cat of categories) {
      if (!cat.title) {
        console.log(`⚠️ Skipping ${cat._id} because it has no title`)
        continue
      }

      let newSlug = slugify(cat.title, { lower: true, strict: true, trim: true })
      console.log(`🔧 Setting slug "${newSlug}" for category "${cat.title}" (${cat._id})`)

      await customClient
        .patch(cat._id)
        .set({ slug: { _type: "slug", current: newSlug } })
        .commit()
    }

    console.log("🏁 Migration finished")
  },
})

import { defineMigration } from 'sanity/migrate';
import slugify from 'slugify';

export default defineMigration({
  title: 'Generate missing slugs for categories',
  async migrate({ client }) {
    // Find all category docs without a slug
    const categories = await client.fetch(
      `*[_type == "category" && !defined(slug.current)]{_id, title}`
    );

    for (const cat of categories) {
      const newSlug = slugify(cat.title, { lower: true });

      await client
        .patch(cat._id)
        .set({ slug: { _type: 'slug', current: newSlug } })
        .commit();

      console.log(`✅ Added slug "${newSlug}" to category "${cat.title}"`);
    }
  },
});

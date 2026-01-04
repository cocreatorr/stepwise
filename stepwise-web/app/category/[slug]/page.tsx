import { sanityClient } from "../../../lib/sanity.client";
import PostCard from "../../../components/PostCard";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch category info + posts
  const data = await sanityClient.fetch(
    `{
      "category": *[_type == "category" && slug.current == $slug][0]{ title, description },
      "posts": *[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc) {
        title,
        slug,
        excerpt,
        mainImage,
        "author": author->{ name, slug },
        categories[]->{ title, slug }
      }
    }`,
    { slug }
  );

  const { category, posts } = data;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Category Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">{category?.title}</h1>
        {category?.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{category.description}</p>
        )}
      </div>

      {/* Category Posts */}
      <h2 className="text-2xl font-semibold mb-6">
        Posts in {category?.title}
      </h2>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <PostCard key={post.slug.current} post={post} />
        ))}
      </ul>
    </section>
  );
}

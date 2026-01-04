import { sanityClient } from "../../../lib/sanity.client";
import PostCard from "../../../components/PostCard";

export const revalidate = 60;

// Generate per‑page metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const tag = await sanityClient.fetch(
    `*[_type == "tag" && slug.current == $slug][0]{ title, description }`,
    { slug: params.slug }
  );
  return {
    title: tag?.title || "Tag",
    description: tag?.description || "Posts grouped by tag",
  };
}

export default async function TagPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch tag info + posts
  const data = await sanityClient.fetch(
    `{
      "tag": *[_type == "tag" && slug.current == $slug][0]{ title, description },
      "posts": *[_type == "post" && $slug in tags[]->slug.current] | order(publishedAt desc) {
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

  const { tag, posts } = data;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Tag Header */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold">{tag?.title ?? "Tag"}</h1>
        {tag?.description && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{tag.description}</p>
        )}
      </div>

      {/* Posts under this tag */}
      <h2 className="text-2xl font-semibold mb-6">
        Posts tagged with {tag?.title ?? slug}
      </h2>
      {posts && posts.length > 0 ? (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard key={post.slug.current} post={post} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500">No posts found for this tag.</p>
      )}
    </section>
  );
}

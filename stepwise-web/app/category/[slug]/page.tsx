import { sanityClient } from "../../../lib/sanity.client";
import PostCard from "../../../components/PostCard";

export const revalidate = 60;

export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const posts = await sanityClient.fetch(
    `*[_type == "post" && $slug in categories[]->slug.current]{
      title,
      excerpt,
      slug,
      "author": author->{ name, slug },
      categories[]->{ title, slug }
    } | order(publishedAt desc)`,
    { slug }
  );

  if (!posts || posts.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold">No posts found for this category.</h2>
      </main>
    );
  }

  const categoryTitle =
    posts[0].categories.find((c: any) => c?.slug?.current === slug)?.title || "Category";

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Posts in {categoryTitle}</h1>
      <ul className="space-y-6">
        {posts.map((post: any) => (
          <PostCard key={post.slug.current} post={post} />
        ))}
      </ul>
    </main>
  );
}

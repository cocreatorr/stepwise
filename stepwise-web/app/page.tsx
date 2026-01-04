import { sanityClient } from "../lib/sanity.client";
import PostCard from "../components/PostCard";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      excerpt,
      mainImage,
      "author": author->{ name },
      categories[]->{ title, slug }
    }`
  );

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Hero / Heading */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
          Stepwise Web
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Developer insights, one clean commit at a time.
        </p>
      </div>

      {/* Latest Posts */}
      <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <PostCard key={post.slug.current} post={post} />
        ))}
      </ul>
    </section>
  );
}

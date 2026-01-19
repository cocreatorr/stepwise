import { sanityClient } from "../lib/sanity.client";
import Link from "next/link";

export const revalidate = 60;

export default async function HomePage() {
  const posts = await sanityClient.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      excerpt,
      "author": author->{ name, "slug": slug.current },
      "categories": categories[]->{ title, "slug": slug.current }
    }`
  );

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Stepwise Web</h1>
        
      </header>

      {/* Tagline */}
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
        Developer insights, one clean commit at a time.
      </p>

      {/* Latest Posts */}
      <section>
        <h2 className="text-2xl font-semibold mb-6">Latest Posts</h2>
        <ul className="space-y-8">
          {posts.map((post: any) => (
            <li key={post.slug.current}>
              <Link href={`/posts/${post.slug.current}`}>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white hover:text-blue-600 underline">
                  {post.title}
                </h3>
              </Link>
              <p className="text-gray-600 dark:text-gray-400 mt-2">{post.excerpt}</p>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-x-4">
                {post.author && (
                  <Link href={`/author/${post.author.slug}`} className="hover:underline">
                    👤 {post.author.name}
                  </Link>
                )}
                {post.categories?.map((cat: any) => (
                  <Link key={cat.slug} href={`/category/${cat.slug}`} className="hover:underline">
                    📁 {cat.title}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </section>

      
    </main>
  );
}

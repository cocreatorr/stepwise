// stepwise-web/app/posts/page.tsx
import Link from "next/link";
import { sanityClient } from "../../lib/sanity.client";
import { urlFor } from "../../lib/urlFor";

// ✅ ISR: refresh every 60s
export const revalidate = 60;

export default async function PostsPage() {
  const query = `*[_type == "post"]{
    title,
    excerpt,
    slug,
    mainImage
  } | order(publishedAt desc)`;

  const posts = await sanityClient.fetch(query);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <article
            key={post.slug.current}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <Link href={`/posts/${post.slug.current}`}>
              {post.mainImage && (
                <img
                  src={urlFor(post.mainImage).width(600).height(400).url()}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm">{post.excerpt}</p>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}


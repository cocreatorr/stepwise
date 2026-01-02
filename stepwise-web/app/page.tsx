import { sanityClient } from "../lib/sanity.client";

export const revalidate = 60; // ISR: revalidate every 60 seconds

export default async function HomePage() {
  const query = `*[_type == "post"]{
    title,
    slug,
    excerpt,
    mainImage
  } | order(publishedAt desc)`;

  const posts = await sanityClient.fetch(query);

  return (
    <div className="flex min-h-screen flex-col font-sans bg-background text-foreground">
      {/* Header */}
      <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <span className="text-lg font-semibold">Stepwise Web</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12">
        <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <li
              key={post.slug.current}
              className="rounded-lg border border-zinc-200 dark:border-zinc-800 p-4 hover:shadow-md transition"
            >
              <a href={`/posts/${post.slug.current}`} className="block">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-sm text-zinc-600 dark:text-zinc-400">
                    {post.excerpt}
                  </p>
                )}
              </a>
            </li>
          ))}
        </ul>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-background">
        <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
          © {new Date().getFullYear()} Stepwise Web. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

import { sanityClient } from "../../../lib/sanity.client";
import Link from "next/link";

export const revalidate = 60;

// Pre-generate static params
export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "category" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

// Metadata
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const { slug } = params;
  const category = await sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ title, description }`,
    { slug }
  );
  return {
    title: category?.title || "Category",
    description: category?.description || "Posts by category",
  };
}

// Page component
export default async function CategoryPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch posts in this category
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
    posts[0].categories.find((c: any) => c.slug.current === slug)?.title || "Category";

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Category heading */}
      <h1 className="text-3xl font-bold mb-6">Posts in {categoryTitle}</h1>

      {/* Posts list */}
      <ul className="space-y-6">
        {posts.map((post: any) => (
          <li
            key={post.slug.current}
            className="border rounded-lg p-4 hover:shadow-md transition"
          >
            <Link href={`/posts/${post.slug.current}`} className="block">
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              {post.excerpt && (
                <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                  {post.excerpt}
                </p>
              )}

              {/* Meta info */}
              <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap gap-2">
                {post.author && (
                  <Link
                    href={`/author/${post.author.slug.current}`}
                    className="hover:underline"
                  >
                    👤 {post.author.name}
                  </Link>
                )}
                {post.categories?.length > 0 && (
                  <span>
                    📂{" "}
                    {post.categories.map((cat: any) =>
                      cat.slug?.current ? (
                        <Link
                          key={cat.slug.current}
                          href={`/category/${cat.slug.current}`}
                          className="hover:underline"
                        >
                          {cat.title}
                        </Link>
                      ) : null
                    )}
                  </span>
                )}
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

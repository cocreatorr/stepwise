import { sanityClient } from "../../../lib/sanity.client";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

// Generate static params for all category slugs
export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "category" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

export default async function CategoryPage(
  props: { params: Promise<{ slug: string }> }
) {
  // ✅ Await params in Next.js 16
  const { slug } = await props.params;

  // Fetch category and its posts
  const category = await sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]{
      title,
      description,
      "posts": *[_type == "post" && references(^._id)]{
        title,
        excerpt,
        "slug": slug.current,
        "author": author->{ name, "slug": slug.current }
      }
    }`,
    { slug }
  );

  if (!category) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">📁 {category.title}</h1>
      {category.description && (
        <p className="text-gray-600 mb-8">{category.description}</p>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        Posts in {category.title}
      </h2>
      <ul className="space-y-6">
        {category.posts.map((post: any) => (
          <li key={post.slug}>
            {/* ✅ Use plural /posts route */}
            <Link href={`/posts/${post.slug}`}>
              <h3 className="text-xl font-semibold text-blue-900 hover:underline">
                {post.title}
              </h3>
            </Link>
            <p className="text-gray-600">{post.excerpt}</p>
            {post.author && (
              <p className="text-sm text-blue-700">
                👤{" "}
                <Link
                  href={`/author/${post.author.slug}`}
                  className="hover:underline"
                >
                  {post.author.name}
                </Link>
              </p>
            )}
          </li>
        ))}
      </ul>
    </main>
  );
}

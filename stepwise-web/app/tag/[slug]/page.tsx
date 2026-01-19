import { sanityClient } from "../../../lib/sanity.client";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "tag" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

export default async function TagPage(
  props: { params: Promise<{ slug: string }> }
) {
  // ✅ Await the params in Next.js 16
  const { slug } = await props.params;

  const tag = await sanityClient.fetch(
    `*[_type == "tag" && slug.current == $slug][0]{
      title,
      description,
      "posts": *[_type == "post" && references(^._id)]{
        title,
        excerpt,
        "slug": slug.current,
        "author": author->{ name, "slug": slug.current },
        "categories": categories[]->{ title, "slug": slug.current }
      }
    }`,
    { slug }
  );

  if (!tag) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">🏷️ {tag.title}</h1>
      {tag.description && <p className="text-gray-600 mb-8">{tag.description}</p>}

      <h2 className="text-2xl font-semibold mb-4">Posts tagged {tag.title}</h2>
      <ul className="space-y-6">
        {tag.posts.map((post: any) => (
          <li key={post.slug}>
            <Link href={`/posts/${post.slug}`}>
              <h3 className="text-xl font-semibold text-blue-900 hover:underline">
                {post.title}
              </h3>
            </Link>
            <p className="text-gray-600">{post.excerpt}</p>
            <div className="text-sm text-blue-700 space-x-2">
              {post.categories?.map((cat: any) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="hover:underline"
                >
                  📁 {cat.title}
                </Link>
              ))}
              {post.author && (
                <Link
                  href={`/author/${post.author.slug}`}
                  className="hover:underline"
                >
                  👤 {post.author.name}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

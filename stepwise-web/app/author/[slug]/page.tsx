import { sanityClient } from "../../../lib/sanity.client";
import Link from "next/link";
import { notFound } from "next/navigation";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "author" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

export default async function AuthorPage(
  props: { params: Promise<{ slug: string }> }
) {
  // ✅ Await the params in Next.js 16
  const { slug } = await props.params;

  const author = await sanityClient.fetch(
    `*[_type == "author" && slug.current == $slug][0]{
      name,
      bio,
      "posts": *[_type == "post" && author._ref == ^._id]{
        title,
        excerpt,
        "slug": slug.current,
        "categories": categories[]->{ title, "slug": slug.current }
      }
    }`,
    { slug }
  );

  if (!author) notFound();

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-4">👤 {author.name}</h1>
      {author.bio && <p className="text-gray-600 mb-8">{author.bio}</p>}

      <h2 className="text-2xl font-semibold mb-4">Posts by {author.name}</h2>
      <ul className="space-y-6">
        {author.posts.map((post: any) => (
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
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}

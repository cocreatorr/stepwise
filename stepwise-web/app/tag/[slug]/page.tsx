// app/tags/[slug]/page.tsx
import { sanityClient } from "../../../lib/sanity.client";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { urlFor } from "../../../lib/urlFor";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "tag" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

// ✅ Metadata for tag pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { tag, settings } = await sanityClient.fetch(
    `{
      "tag": *[_type == "tag" && slug.current == $slug][0]{
        title,
        description,
        openGraphImage
      },
      "settings": *[_type == "settings"][0]{
        siteTitle,
        openGraphImage
      }
    }`,
    { slug }
  );

  if (!tag) {
    return {
      title: "Tag not found",
      description: "This tag does not exist",
    };
  }

  const title = `${tag.title} · ${settings?.siteTitle || "Stepwise Web"}`;
  const description =
    tag.description || `Posts tagged with ${tag.title}.`;

  const ogImage = tag.openGraphImage
    ? urlFor(tag.openGraphImage).width(1200).height(630).url()
    : settings?.openGraphImage
    ? urlFor(settings.openGraphImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function TagPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

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
      {tag.description && (
        <p className="text-gray-600 mb-8">{tag.description}</p>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        Posts tagged {tag.title}
      </h2>

      {tag.posts?.length > 0 ? (
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
      ) : (
        <p className="text-gray-500">No posts found for this tag.</p>
      )}
    </main>
  );
}

// app/author/[slug]/page.tsx
import { sanityClient } from "../../../lib/sanity.client";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { urlFor } from "../../../lib/urlFor";
import NextImage from "../../../lib/NextImage";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "author" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

// ✅ Metadata for author pages
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { author, settings } = await sanityClient.fetch(
    `{
      "author": *[_type == "author" && slug.current == $slug][0]{
        name,
        bio,
        image,
        openGraphImage
      },
      "settings": *[_type == "settings"][0]{
        siteTitle,
        openGraphImage
      }
    }`,
    { slug }
  );

  if (!author) {
    return {
      title: "Author not found",
      description: "This author does not exist",
    };
  }

  const title = `${author.name} · ${settings?.siteTitle || "Stepwise Web"}`;
  const description =
    author.bio || `Posts written by ${author.name}.`;

  const ogImage = author.openGraphImage
    ? urlFor(author.openGraphImage).width(1200).height(630).url()
    : author.image
    ? urlFor(author.image).width(1200).height(630).url()
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

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const author = await sanityClient.fetch(
    `*[_type == "author" && slug.current == $slug][0]{
      name,
      bio,
      image,
      "posts": *[_type == "post" && references(^._id)]{
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

      {author.image && (
        <NextImage
          source={author.image}
          alt={author.name}
          width={120}
          height={120}
          className="rounded-full mb-4 shadow-md"
        />
      )}

      {author.bio && (
        <p className="text-gray-600 mb-8">{author.bio}</p>
      )}

      <h2 className="text-2xl font-semibold mb-4">
        Posts by {author.name}
      </h2>

      {author.posts?.length > 0 ? (
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
                    📂 {cat.title}
                  </Link>
                ))}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-500">No posts found for this author.</p>
      )}
    </main>
  );
}

// app/page.tsx
import { sanityClient } from "../lib/sanity.client";
import Link from "next/link";
import NextImage from "../lib/NextImage";
import { urlFor } from "../lib/urlFor";
import type { Metadata } from "next";

export const revalidate = 60;

// ✅ Homepage metadata with site-level OG fallback
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityClient.fetch(
    `*[_type == "settings"][0]{
      siteTitle,
      description,
      openGraphImage
    }`
  );

  const siteTitle = settings?.siteTitle || "Stepwise Web";
  const description =
    settings?.description || "Developer insights, one clean commit at a time.";

  const ogImageUrl = settings?.openGraphImage
    ? urlFor(settings.openGraphImage).width(1200).height(630).url()
    : undefined;

  return {
    title: siteTitle,
    description,
    openGraph: {
      title: siteTitle,
      description,
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description,
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function HomePage() {
  const query = `{
    "posts": *[_type == "post"] | order(publishedAt desc) {
      title,
      slug,
      excerpt,
      mainImage,
      "author": author->{ name, "slug": slug.current },
      "categories": categories[]->{ title, "slug": slug.current }
    },
    "settings": *[_type == "settings"][0]{
      siteTitle,
      description,
      logo,
      favicon,
      tags[]{ label, slug, order }
    }
  }`;

  const { posts, settings } = await sanityClient.fetch(query);

  return (
    <main className="max-w-6xl mx-auto px-6 py-12">
      {/* Header */}
      <header className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          {settings?.logo && (
            <NextImage
              source={settings.logo}
              alt={settings.siteTitle}
              width={40}
              height={40}
              className="rounded"
            />
          )}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {settings?.siteTitle || "Stepwise Web"}
          </h1>
        </div>

        {/* Navigation tags */}
        <nav className="space-x-6">
          {settings?.tags?.map((tag: any) =>
            tag?.slug?.current ? (
              <Link
                key={tag.slug.current}
                href={`/tag/${tag.slug.current}`}
                className="text-blue-700 dark:text-blue-400 hover:underline"
              >
                {tag.label}
              </Link>
            ) : (
              <span key={tag.label} className="text-gray-400">
                {tag.label}
              </span>
            )
          )}
        </nav>
      </header>

      {/* Tagline from Sanity settings */}
      <p className="text-lg text-gray-600 dark:text-gray-400 mb-10">
        {settings?.description ||
          "Developer insights, one clean commit at a time."}
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
              {post.mainImage && (
                <NextImage
                  source={post.mainImage}
                  alt={post.title}
                  width={600}
                  height={350}
                  className="rounded-lg shadow-md my-4"
                />
              )}
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {post.excerpt}
              </p>
              <div className="mt-2 text-sm text-blue-700 dark:text-blue-400 space-x-4">
                {post.author && (
                  <Link
                    href={`/author/${post.author.slug}`}
                    className="hover:underline"
                  >
                    👤 {post.author.name}
                  </Link>
                )}
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
      </section>
    </main>
  );
}

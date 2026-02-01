// app/posts/[slug]/page.tsx
import { sanityClient } from "../../../lib/sanity.client";
import { PortableText } from "@portabletext/react";
import ReactMarkdown from "react-markdown";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import NextImage from "../../../lib/NextImage";
import { urlFor } from "../../../lib/urlFor";

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const { post, settings } = await sanityClient.fetch(
    `{
      "post": *[_type == "post" && slug.current == $slug][0]{
        title,
        excerpt,
        seoTitle,
        seoDescription,
        openGraphImage,
        publishedAt,
        "author": author->{ name, "slug": slug.current },
        "categories": categories[]->{ title, "slug": slug.current }
      },
      "settings": *[_type == "settings"][0]{
        siteTitle,
        openGraphImage
      }
    }`,
    { slug }
  );

  if (!post) {
    return {
      title: "Post not found",
      description: "This post does not exist",
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const ogImage = post.openGraphImage
    ? urlFor(post.openGraphImage).width(1200).height(630).url()
    : settings?.openGraphImage
    ? urlFor(settings.openGraphImage).width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: { canonical: `/posts/${slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      publishedTime: post.publishedAt,
      authors: post.author ? [post.author.name] : [],
      tags: post.categories?.map((c: any) => c.title),
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

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      excerpt,
      body,
      bodyMarkdown,
      mainImage,
      "author": author->{ name, "slug": slug.current },
      "categories": categories[]->{ title, "slug": slug.current },
      publishedAt,
      readingTime
    }`,
    { slug }
  );

  if (!post) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12 bg-white text-black">
      <h1 className="text-4xl font-bold mb-2 text-blue-900">{post.title}</h1>

      <div className="flex items-center gap-4 text-sm text-blue-700 mb-6">
        {post.author && (
          <Link href={`/author/${post.author.slug}`} className="hover:underline">
            👤 {post.author.name}
          </Link>
        )}
        {post.publishedAt && (
          <span>📅 {new Date(post.publishedAt).toLocaleDateString()}</span>
        )}
        {post.readingTime && <span>⏱ {post.readingTime} min read</span>}
        {post.categories?.length > 0 && (
          <span>
            📂{" "}
            {post.categories.map((cat: any, idx: number) =>
              cat?.slug ? (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  className="hover:underline text-blue-700"
                >
                  {cat.title}
                  {idx < post.categories.length - 1 && ", "}
                </Link>
              ) : (
                <span key={idx}>
                  {cat.title}
                  {idx < post.categories.length - 1 && ", "}
                </span>
              )
            )}
          </span>
        )}
      </div>

      {post.mainImage && (
        <NextImage
          source={post.mainImage}
          alt={post.title}
          width={800}
          height={450}
          className="w-full h-auto rounded-lg mb-6 shadow-md"
          priority
        />
      )}

      <article className="prose prose-blue max-w-none">
        {post.bodyMarkdown ? (
          <ReactMarkdown>{post.bodyMarkdown}</ReactMarkdown>
        ) : post.body ? (
          <PortableText value={post.body} />
        ) : (
          <p>No content available.</p>
        )}
      </article>
    </main>
  );
}

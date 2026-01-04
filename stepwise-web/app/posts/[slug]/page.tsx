import { sanityClient } from "../../../lib/sanity.client";
import { PortableText } from "@portabletext/react";
import ReactMarkdown from "react-markdown";
import { urlFor } from "../../../lib/urlFor";
import Link from "next/link";
import type { Metadata } from "next";

export const revalidate = 60;

// Pre-generate static params for all slugs
export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

// Metadata for SEO/OG
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params; // ✅ unwrap params
  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ title, excerpt }`,
    { slug }
  );

  return {
    title: post?.title || "Post",
    description: post?.excerpt || "Stepwise Web post",
    openGraph: {
      title: post?.title || "Post",
      description: post?.excerpt || "Stepwise Web post",
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post?.title || "Stepwise Web")}`,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: post?.title || "Post",
      description: post?.excerpt || "Stepwise Web post",
      images: [`/api/og?title=${encodeURIComponent(post?.title || "Stepwise Web")}`],
    },
  };
}

// Page component
export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params; // ✅ unwrap params

  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{
      title,
      excerpt,
      mainImage,
      body,
      bodyMarkdown,
      "author": author->name,
      categories[]->{ title, slug },
      publishedAt
    }`,
    { slug }
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold mb-2">{post?.title || "Untitled Post"}</h1>

      <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        {post?.author && <span>👤 {post.author}</span>}
        {post?.publishedAt && (
          <span>📅 {new Date(post.publishedAt).toLocaleDateString()}</span>
        )}
        {post?.categories?.length > 0 && (
          <span>
            📂{" "}
            {post.categories.map((cat: any, idx: number) =>
              cat?.slug?.current ? (
                <Link
                  key={cat.slug.current}
                  href={`/category/${cat.slug.current}`}
                  className="hover:underline"
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

      {post?.mainImage && (
        <img
          src={urlFor(post.mainImage).width(800).url()}
          alt={post?.title || "Post image"}
          className="w-full h-auto rounded-lg mb-6 shadow-md"
        />
      )}

      <article className="prose dark:prose-invert max-w-none">
        {post?.bodyMarkdown ? (
          <ReactMarkdown>{post.bodyMarkdown}</ReactMarkdown>
        ) : post?.body ? (
          <PortableText value={post.body} />
        ) : (
          <p>No content available.</p>
        )}
      </article>
    </main>
  );
}

import { sanityClient } from "../../../lib/sanity.client";
import { PortableText } from "@portabletext/react";
import { urlFor } from "../../../lib/urlFor";
import type { Metadata } from "next";

export const revalidate = 60;

// Pre-generate static params
export async function generateStaticParams() {
  const slugs: string[] = await sanityClient.fetch(
    `*[_type == "post" && defined(slug.current)][].slug.current`
  );
  return slugs.map((slug) => ({ slug }));
}

// Metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await sanityClient.fetch(
    `*[_type == "post" && slug.current == $slug][0]{ title, excerpt }`,
    { slug }
  );
  return {
    title: post?.title || "Post",
    description: post?.excerpt || "Stepwise Web post",
  };
}

// Page component
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
      mainImage,
      body,
      "author": author->name,
      categories[]->{
        title
      }
    }`,
    { slug }
  );

  if (!post) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h2>Post not found</h2>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      {/* Post title */}
      <h1 className="text-4xl font-bold mb-2">{post.title}</h1>

      {/* Meta info */}
      <div className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400 mb-6">
        {post.author && <span>👤 {post.author}</span>}
        {post.categories?.length > 0 && (
          <span>
            📂 {post.categories.map((cat: any) => cat.title).join(", ")}
          </span>
        )}
      </div>

      {/* Featured image */}
      {post.mainImage && (
        <img
          src={urlFor(post.mainImage).url()}
          alt={post.title}
          className="w-full h-auto rounded-lg mb-6 shadow-md"
        />
      )}

      {/* Body */}
      <article className="prose dark:prose-invert max-w-none">
        <PortableText value={post.body} />
      </article>
    </main>
  );
}

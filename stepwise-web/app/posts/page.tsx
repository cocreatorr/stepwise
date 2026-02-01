// app/posts/page.tsx
import Link from "next/link";
import { sanityClient } from "../../lib/sanity.client";
import NextImage from "../../lib/NextImage";
import { urlFor } from "../../lib/urlFor";
import type { Metadata } from "next";

export const revalidate = 60;
const POSTS_PER_PAGE = 6;

// ✅ Metadata for Posts Index
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityClient.fetch(
    `*[_type == "settings"][0]{
      siteTitle,
      openGraphImage
    }`
  );

  const siteTitle = settings?.siteTitle || "Stepwise Web";
  const ogImageUrl = settings?.openGraphImage
    ? urlFor(settings.openGraphImage).width(1200).height(630).url()
    : undefined;

  return {
    title: `${siteTitle} · Posts`,
    description: "Browse all developer insights and articles.",
    openGraph: {
      title: `${siteTitle} · Posts`,
      description: "Browse all developer insights and articles.",
      images: ogImageUrl ? [{ url: ogImageUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteTitle} · Posts`,
      description: "Browse all developer insights and articles.",
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default async function PostsPage({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const currentPage = parseInt(searchParams?.page || "1", 10);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const end = start + POSTS_PER_PAGE;

  const query = `{
    "posts": *[_type == "post"] | order(publishedAt desc) [${start}...${end}]{
      title,
      excerpt,
      slug,
      mainImage
    },
    "total": count(*[_type == "post"])
  }`;

  const { posts, total } = await sanityClient.fetch(query);
  const totalPages = Math.ceil(total / POSTS_PER_PAGE);

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Latest Posts</h1>
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <article
            key={post.slug.current}
            className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden"
          >
            <Link href={`/posts/${post.slug.current}`}>
              {post.mainImage && (
                <NextImage
                  source={post.mainImage}
                  alt={post.title}
                  width={600}
                  height={400}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                {post.excerpt && (
                  <p className="text-gray-600 text-sm">{post.excerpt}</p>
                )}
              </div>
            </Link>
          </article>
        ))}
      </div>

      {/* Pagination controls */}
      <div className="flex justify-center items-center gap-2 mt-10 flex-wrap">
        {currentPage > 1 && (
          <Link
            href={`/posts?page=${currentPage - 1}`}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            ← Prev
          </Link>
        )}

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Link
            key={page}
            href={`/posts?page=${page}`}
            className={`px-3 py-2 rounded ${
              page === currentPage
                ? "bg-blue-700 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {page}
          </Link>
        ))}

        {currentPage < totalPages && (
          <Link
            href={`/posts?page=${currentPage + 1}`}
            className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Next →
          </Link>
        )}
      </div>
    </main>
  );
}

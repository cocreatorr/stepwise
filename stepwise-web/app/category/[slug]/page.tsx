import { sanityClient } from "../../../lib/sanity.client";
import PostCard from "../../../components/PostCard";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  const category = await sanityClient.fetch(
    `*[_type == "category" && slug.current == $slug][0]{ title, description }`,
    { slug }
  );

  return {
    title: category?.title || "Category",
    description: category?.description || "Posts grouped by category",
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const data = await sanityClient.fetch(
    `{
      "category": *[_type == "category" && slug.current == $slug][0]{ title, description },
      "posts": *[_type == "post" && $slug in categories[]->slug.current] | order(publishedAt desc) {
        title,
        slug,
        excerpt,
        mainImage,
        "author": author->{ name, slug },
        categories[]->{ title, slug }
      }
    }`,
    { slug }
  );

  const { category, posts } = data;

  if (!category) notFound();

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 bg-background text-text">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-heading">{category?.title}</h1>
        {category?.description && (
          <p className="mt-2 text-link">{category.description}</p>
        )}
      </div>

      <h2 className="text-2xl font-semibold mb-6 text-heading">
        Posts in {category?.title}
      </h2>
      {posts?.length > 0 ? (
        <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post: any) => (
            <PostCard key={post.slug.current} post={post} />
          ))}
        </ul>
      ) : (
        <p className="text-center text-subtle">No posts found in this category.</p>
      )}
    </section>
  );
}

import { sanityClient } from "../../../lib/sanity.client";
import PostCard from "../../../components/PostCard";

export const revalidate = 60;

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  // Fetch author info + posts
  const data = await sanityClient.fetch(
    `{
      "author": *[_type == "author" && slug.current == $slug][0]{ name, bio, image },
      "posts": *[_type == "post" && author->slug.current == $slug] | order(publishedAt desc) {
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

  const { author, posts } = data;

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      {/* Author Header */}
      <div className="mb-10 text-center">
        {author?.image && (
          <img
            src={author.image.asset.url}
            alt={author.name}
            className="mx-auto h-24 w-24 rounded-full object-cover mb-4"
          />
        )}
        <h1 className="text-3xl font-bold">{author?.name}</h1>
        {author?.bio && (
          <p className="mt-2 text-gray-600 dark:text-gray-400">{author.bio}</p>
        )}
      </div>

      {/* Author Posts */}
      <h2 className="text-2xl font-semibold mb-6">Posts by {author?.name}</h2>
      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post: any) => (
          <PostCard key={post.slug.current} post={post} />
        ))}
      </ul>
    </section>
  );
}

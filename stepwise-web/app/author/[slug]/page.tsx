import { sanityClient } from "../../../lib/sanity.client";
import PostCard from "../../../components/PostCard";

export const revalidate = 60;

export default async function AuthorPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const posts = await sanityClient.fetch(
    `*[_type == "post" && author->slug.current == $slug]{
      title,
      excerpt,
      slug,
      "author": author->{ name, slug },
      categories[]->{ title, slug }
    } | order(publishedAt desc)`,
    { slug }
  );

  if (!posts || posts.length === 0) {
    return (
      <main className="max-w-3xl mx-auto px-6 py-12">
        <h2 className="text-xl font-semibold">No posts found for this author.</h2>
      </main>
    );
  }

  const author = await sanityClient.fetch(
    `*[_type == "author" && slug.current == $slug][0]{ name }`,
    { slug }
  );

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Posts by {author?.name}</h1>
      <ul className="space-y-6">
        {posts.map((post: any) => (
          <PostCard key={post.slug.current} post={post} />
        ))}
      </ul>
    </main>
  );
}

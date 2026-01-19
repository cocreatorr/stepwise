import Card from "../../components/Card";
import { sanityClient } from "../../lib/sanity.client";
import Link from "next/link";

export const revalidate = 60;

export default async function TagIndexPage() {
  // Query all tags from Sanity
  const tags = await sanityClient.fetch(
    `*[_type == "tag"] | order(title asc) {
      title,
      "slug": slug.current,
      description
    }`
  );

  return (
    <main className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8">Tags</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tags.map((tag: any) => (
          <li key={tag.slug}>
            <Link href={`/tag/${tag.slug}`}>
              <Card title={tag.title} description={tag.description} />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

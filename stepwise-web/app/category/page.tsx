import { sanityClient } from "../../lib/sanity.client";
import Link from "next/link";

export const revalidate = 60;

export default async function CategoryIndexPage() {
  const categories = await sanityClient.fetch(
    `*[_type == "category" && defined(slug.current)] | order(title asc) {
      _id,
      title,
      slug,
      description
    }`
  );

  return (
    <section className="max-w-6xl mx-auto px-6 py-12 bg-white text-black">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-blue-900">Categories</h1>
        <p className="mt-2 text-lg text-blue-700">
          Browse posts grouped by category
        </p>
      </div>

      <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat: any) => (
          <li
            key={cat._id}
            className="bg-white rounded-lg shadow-sm hover:shadow-md transition border border-gray-200 p-6"
          >
            <Link
              href={`/category/${cat.slug.current}`}
              className="block hover:underline"
            >
              <h2 className="text-xl font-semibold mb-2 text-blue-900">
                {cat.title}
              </h2>
            </Link>
            {cat.description && (
              <p className="text-sm text-blue-700">{cat.description}</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

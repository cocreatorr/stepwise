import Link from "next/link";
import { urlFor } from "../lib/urlFor";

export default function PostCard({ post }: { post: any }) {
  const categories = post.categories || [];

  return (
    <li className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden">
      <Link href={`/posts/${post.slug.current}`} className="block">
        {post.mainImage && (
          <img
            src={urlFor(post.mainImage).width(600).height(400).url()}
            alt={post.title}
            className="w-full h-48 object-cover"
          />
        )}

        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          {post.excerpt && (
            <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
          )}

          {/* Author + Categories with spacing */}
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            {post.author?.name && (
              <div className="flex items-center">
                👤 <span className="ml-1">{post.author.name}</span>
              </div>
            )}
            {categories.length > 0 && (
              <div className="flex items-center">
                📂{" "}
                {categories.map((cat: any, idx: number) =>
                  cat?.slug?.current ? (
                    <Link
                      key={`${cat.slug.current}-${idx}`}
                      href={`/category/${cat.slug.current}`}
                      className="hover:underline ml-1"
                    >
                      {cat.title}
                      {idx < categories.length - 1 && ", "}
                    </Link>
                  ) : (
                    <span key={idx} className="ml-1">
                      {cat.title}
                      {idx < categories.length - 1 && ", "}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

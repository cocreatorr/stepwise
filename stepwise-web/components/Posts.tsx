import { useEffect, useState } from "react";
import Link from "next/link";

export default function Posts() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then((data) => setPosts(data));
  }, []);

  return (
    <ul className="space-y-6">
      {posts.map((post) => (
        <li
          key={post._id}
          className="border rounded-lg p-4 hover:shadow-md transition"
        >
          {/* Post title */}
          <Link href={`/posts/${post.slug.current}`} className="block">
            <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
          </Link>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
              {post.excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="mt-2 text-xs text-zinc-500 dark:text-zinc-400 flex flex-wrap gap-2">
            {post.author && post.author.slug?.current && (
              <Link
                href={`/author/${post.author.slug.current}`}
                className="hover:underline"
              >
                👤 {post.author.name}
              </Link>
            )}
            {post.categories?.length > 0 && (
              <span>
                📂{" "}
                {post.categories.map((cat: any, idx: number) =>
                  cat.slug?.current ? (
                    <Link
                      key={cat.slug.current}
                      href={`/category/${cat.slug.current}`}
                      className="hover:underline"
                    >
                      {cat.title}
                      {idx < post.categories.length - 1 && ", "}
                    </Link>
                  ) : null
                )}
              </span>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}

import React from "react";
import Link from "next/link";
import Image from "next/image";

type PostCardProps = {
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: string;
  author?: string;
  date?: string;
};

export default function PostCard({
  title,
  slug,
  excerpt,
  mainImage,
  author,
  date,
}: PostCardProps) {
  return (
    <Link
      href={`/posts/${slug}`}
      className="block bg-background border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition"
    >
      {mainImage && (
        <Image
          src={mainImage}
          alt={title}
          width={600}
          height={400}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-heading text-xl font-semibold mb-2">{title}</h2>

        {excerpt && (
          <p className="text-subtle text-sm mb-4 line-clamp-3">{excerpt}</p>
        )}

        <div className="flex items-center justify-between text-xs text-subtle">
          {author && <span>By {author}</span>}
          {date && <span>{new Date(date).toLocaleDateString()}</span>}
        </div>
      </div>
    </Link>
  );
}

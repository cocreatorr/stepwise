import React from "react";
import clsx from "clsx";
import Link from "next/link";

type CardProps = {
  title: string;
  description?: string;
  href?: string;
  imageUrl?: string;
  footer?: React.ReactNode;
  className?: string;
};

/**
 * Reusable Card component
 * - Uses semantic Tailwind utilities (bg-background, text-heading, text-link, etc.)
 * - Supports optional image, description, footer, and link wrapping
 * - Accessible: alt text for images, semantic HTML
 */
export default function Card({
  title,
  description,
  href,
  imageUrl,
  footer,
  className,
}: CardProps) {
  const content = (
    <div
      className={clsx(
        "bg-background border border-border rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition",
        className
      )}
    >
      {imageUrl && (
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h2 className="text-heading text-xl font-semibold mb-2">{title}</h2>
        {description && (
          <p className="text-subtle text-sm mb-4">{description}</p>
        )}
        {footer && <div className="mt-4">{footer}</div>}
      </div>
    </div>
  );

  return href ? (
    <Link href={href} className="block">
      {content}
    </Link>
  ) : (
    content
  );
}

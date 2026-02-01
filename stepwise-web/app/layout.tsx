// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { sanityClient } from "../lib/sanity.client";
import { urlFor } from "../lib/urlFor";
import type { Metadata } from "next";

export const revalidate = 60;

// Dynamically fetch site settings for metadata (title + favicon + fallback OG image)
export async function generateMetadata(): Promise<Metadata> {
  const settings = await sanityClient.fetch(
    `*[_type == "settings"][0]{
      siteTitle,
      favicon,
      openGraphImage
    }`
  );

  const siteTitle = settings?.siteTitle || "Stepwise Web";
  const faviconUrl = settings?.favicon
    ? urlFor(settings.favicon).width(32).height(32).url()
    : undefined;
  const ogImageUrl = settings?.openGraphImage
    ? urlFor(settings.openGraphImage).width(1200).height(630).url()
    : undefined;

  return {
    title: siteTitle,
    description: "Developer insights, one clean commit at a time.",
    icons: faviconUrl ? { icon: faviconUrl } : undefined,
    openGraph: {
      title: siteTitle,
      description: "Developer insights, one clean commit at a time.",
      images: ogImageUrl
        ? [{ url: ogImageUrl, width: 1200, height: 630 }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title: siteTitle,
      description: "Developer insights, one clean commit at a time.",
      images: ogImageUrl ? [ogImageUrl] : [],
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-background text-text">
        {/* Navigation */}
        <header className="border-b border-border bg-background">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-bold text-heading">
              Stepwise Web
            </Link>
            <div className="flex gap-6 font-medium">
              <Link href="/posts" className="text-link hover:text-linkHover">
                Posts
              </Link>
              <Link href="/category" className="text-link hover:text-linkHover">
                Categories
              </Link>
              <Link href="/tag" className="text-link hover:text-linkHover">
                Tags
              </Link>
              <Link href="/about" className="text-link hover:text-linkHover">
                About
              </Link>
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-background">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-subtle text-sm">
            © {new Date().getFullYear()} Stepwise Web · Built with Next.js & Sanity
          </div>
        </footer>
      </body>
    </html>
  );
}

import "./globals.css";
import type { Metadata } from "next";
import { sanityClient } from "../lib/sanity.client";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stepwise Web",
  description: "Next.js + TailwindCSS project",
  metadataBase: new URL("https://stepwise-web.vercel.app"), // replace with your deployed domain
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: any[] = [];
  try {
    // ✅ Removed unsupported unique(), just order categories
    categories = await sanityClient.fetch(
      `*[_type == "category"]{ _id, title, slug } | order(title asc)`
    );

    // ✅ Deduplicate categories in JS
    const seen = new Set();
    categories = categories.filter((cat: any) => {
      if (!cat?.slug?.current) return false;
      if (seen.has(cat.slug.current)) return false;
      seen.add(cat.slug.current);
      return true;
    });
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-foreground font-sans antialiased min-h-screen">
        <div className="flex flex-col min-h-screen">
          {/* Global Header */}
          <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
              {/* Home Button */}
              <Link href="/" className="text-lg font-semibold hover:underline">
                Home
              </Link>

              {/* Category Navigation */}
              <nav className="flex gap-6 text-sm text-zinc-700 dark:text-zinc-300">
                {Array.isArray(categories) &&
                  categories.map((cat: any) =>
                    cat?.slug?.current ? (
                      <Link
                        key={cat.slug.current}
                        href={`/category/${cat.slug.current}`}
                        className="hover:underline"
                      >
                        {cat.title}
                      </Link>
                    ) : (
                      <span key={cat._id}>{cat.title}</span>
                    )
                  )}
              </nav>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12">
            {children}
          </main>

          {/* Global Footer */}
          <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-background">
            <div className="mx-auto max-w-6xl px-6 py-6 text-sm text-zinc-600 dark:text-zinc-400">
              © {new Date().getFullYear()} Stepwise Web. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}

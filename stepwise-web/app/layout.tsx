import "./globals.css";
import type { Metadata } from "next";
import { sanityClient } from "../lib/sanity.client";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Stepwise Web",
  description: "Next.js + TailwindCSS project",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let categories: any[] = [];
  try {
    categories = await sanityClient.fetch(
      `*[_type == "category"]{ title, slug } | order(title asc)`
    );
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }

  return (
    <html lang="en" className="scroll-smooth">
      <body className="bg-background text-foreground font-sans antialiased min-h-screen">
        <div className="flex flex-col min-h-screen">
          {/* Header with nav */}
          <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
            <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
              <span className="text-lg font-semibold">Stepwise Web</span>
              <nav className="flex gap-6 text-sm text-zinc-700 dark:text-zinc-300">
                {Array.isArray(categories) &&
                  categories.map(
                    (cat: any) =>
                      cat.slug?.current && (
                        <Link
                          key={cat.slug.current}
                          href={`/category/${cat.slug.current}`}
                          className="hover:underline"
                        >
                          {cat.title}
                        </Link>
                      )
                  )}
              </nav>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 mx-auto w-full max-w-6xl px-6 py-12">
            {children}
          </main>

          {/* Footer */}
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

import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Stepwise Web",
  description: "Developer insights, one clean commit at a time.",
  metadataBase: new URL("https://your-production-domain.com"), // replace with your real domain
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 dark:bg-zinc-950 text-gray-900 dark:text-white">
        {/* Header */}
        <header className="border-b border-gray-200 dark:border-zinc-800">
          <nav className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="text-xl font-bold hover:underline">
              Stepwise Web
            </Link>
            <div className="flex space-x-6 text-lg font-medium">
              <Link href="/category" className="hover:underline">
                Categories
              </Link>
              <Link href="/tag" className="hover:underline">
                Tags
              </Link>
              <Link href="/about" className="hover:underline">
                About
              </Link>
            </div>
          </nav>
        </header>

        {/* Content */}
        <main className="max-w-6xl mx-auto px-6 py-12">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-200 dark:border-zinc-800 mt-12 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} Stepwise Web. All rights reserved.
        </footer>
      </body>
    </html>
  );
}

import "./globals.css";
import Link from "next/link";

export const metadata = {
  title: "Stepwise Web",
  description: "Developer insights, one clean commit at a time.",
};

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
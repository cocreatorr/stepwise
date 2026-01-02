"use client";

import Image from "next/image";
import MobileMenu from "./MobileMenu";

export default function Header() {
  return (
    <header className="w-full border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-black/80 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <Image
            className="dark:invert"
            src="/next.svg"
            alt="Next.js logo"
            width={32}
            height={32}
            priority
          />
          <span className="text-lg font-semibold text-black dark:text-zinc-50">
            Stepwise Web
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#features" className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">
            Features
          </a>
          <a href="#docs" className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">
            Docs
          </a>
          <a href="#about" className="text-zinc-700 hover:text-black dark:text-zinc-300 dark:hover:text-white">
            About
          </a>
        </nav>

        {/* Mobile Menu */}
        <MobileMenu
          links={[
            { label: "Features", href: "#features" },
            { label: "Docs", href: "#docs" },
            { label: "About", href: "#about" }
          ]}
        />
      </div>
    </header>
  );
}

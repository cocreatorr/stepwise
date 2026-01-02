"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MobileMenuProps {
  links: { label: string; href: string }[];
}

export default function MobileMenu({ links }: MobileMenuProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setMenuOpen(true)}
        className="md:hidden p-2 rounded-md border border-zinc-300 dark:border-zinc-600"
      >
        <span className="sr-only">Open menu</span>
        <div className="space-y-1">
          <span className="block w-6 h-0.5 bg-zinc-700 dark:bg-zinc-300"></span>
          <span className="block w-6 h-0.5 bg-zinc-700 dark:bg-zinc-300"></span>
          <span className="block w-6 h-0.5 bg-zinc-700 dark:bg-zinc-300"></span>
        </div>
      </button>

      {/* Overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex flex-col items-center justify-center"
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-md border border-zinc-300 dark:border-zinc-600 bg-white dark:bg-black"
            >
              <span className="sr-only">Close menu</span>
              ✕
            </button>
            <motion.nav
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { staggerChildren: 0.15 }
                }
              }}
              className="flex flex-col gap-8 text-2xl font-semibold text-white"
            >
              {links.map((link) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  className="hover:text-pink-300 transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

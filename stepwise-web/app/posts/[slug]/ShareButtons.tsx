"use client";

import { usePathname } from "next/navigation";
import { useState } from "react";
import { FaLinkedin, FaWhatsapp, FaLink } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

type Platform = "twitter" | "linkedin" | "whatsapp" | "copy";

interface ShareButtonsProps {
  platforms?: Platform[];
}

export default function ShareButtons({
  platforms = ["copy", "linkedin", "whatsapp"],
}: ShareButtonsProps) {
  const pathname = usePathname() ?? "";
  const [copied, setCopied] = useState(false);

  const shareUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}${pathname}`
      : pathname;

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-8 flex gap-6 items-center text-sm">
      {platforms.includes("copy") && (
        <button
          onClick={handleCopy}
          aria-label="Copy link to clipboard"
          className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700"
        >
          <FaLink />
          {copied ? "Copied!" : "Copy Link"}
        </button>
      )}

      {platforms.includes("twitter") && (
        <a
          href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on X"
          className="flex items-center gap-2 text-black hover:underline"
        >
          <FaXTwitter /> Share on X
        </a>
      )}

      {platforms.includes("linkedin") && (
        <a
          href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            shareUrl
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on LinkedIn"
          className="flex items-center gap-2 text-blue-700 hover:underline"
        >
          <FaLinkedin /> LinkedIn
        </a>
      )}

      {platforms.includes("whatsapp") && (
        <a
          href={`https://wa.me/?text=${encodeURIComponent(shareUrl)}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Share on WhatsApp"
          className="flex items-center gap-2 text-green-600 hover:underline"
        >
          <FaWhatsapp /> WhatsApp
        </a>
      )}
    </div>
  );
}

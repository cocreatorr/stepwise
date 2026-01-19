import React from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary";
  className?: string;
  disabled?: boolean;
};

/**
 * Reusable Button component
 * - Uses semantic Tailwind utilities (bg-link, text-background, etc.)
 * - Supports primary and secondary variants
 * - Accessible: proper type, disabled state, focus ring
 */
export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className,
  disabled = false,
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center px-4 py-2 rounded-md font-medium transition focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variants = {
    primary:
      "bg-link text-background hover:bg-linkHover focus:ring-link disabled:opacity-50 disabled:cursor-not-allowed",
    secondary:
      "bg-background text-link border border-border hover:bg-linkHover hover:text-background focus:ring-link disabled:opacity-50 disabled:cursor-not-allowed",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(baseStyles, variants[variant], className)}
    >
      {children}
    </button>
  );
}

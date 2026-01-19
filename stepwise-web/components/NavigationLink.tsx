import Link from "next/link";
import clsx from "clsx";

type NavigationLinkProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * NavigationLink component
 * - Consistent styling for header/footer links
 * - Uses semantic Tailwind utilities (text-link, hover:text-linkHover)
 * - Accessible: focus ring for keyboard navigation
 */
export default function NavigationLink({ href, children, className }: NavigationLinkProps) {
  return (
    <Link
      href={href}
      className={clsx(
        "text-link hover:text-linkHover transition focus:outline-none focus:ring-2 focus:ring-link focus:ring-offset-2",
        className
      )}
    >
      {children}
    </Link>
  );
}

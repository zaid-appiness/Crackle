"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { clsx } from "clsx";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Top 10", href: "/top-10" },
  { name: "Popular", href: "/popular" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-black/90 sticky top-0 z-50 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-red-600">
            Crackle
          </Link>
          <div className="flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "text-sm font-medium transition-colors",
                  pathname === item.href
                    ? "text-white"
                    : "text-gray-300 hover:text-white"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

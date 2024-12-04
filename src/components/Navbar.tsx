"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaSearch, FaTimes, FaBars, FaChevronDown } from "react-icons/fa";
import { genreData } from "@/utils/constants";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/trending", label: "Trending" },
  { href: "/popular", label: "Popular" },
  { href: "/top-rated", label: "Top 10" },
];

function GenreDropdown({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Show only first 6 genres in dropdown
  const featuredGenres = genreData.slice(0, 3).flatMap(({ genres }) => genres);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          className="absolute top-full right-0 mt-2 w-[350px] bg-gray-900/95 backdrop-blur-sm 
          rounded-xl shadow-xl border border-gray-700/50 overflow-hidden"
        >
          <div className="p-4 space-y-4">
            {/* Featured Genres Grid */}
            <div className="grid grid-cols-2 gap-2">
              {featuredGenres.map((genre) => (
                <Link
                  key={genre.id}
                  href={`/genres?selected=${genre.id}`}
                  className={`group flex items-center gap-3 p-3 rounded-lg 
                  transition-all duration-300 bg-gradient-to-br ${genre.color} 
                  hover:scale-[1.02] hover:shadow-lg
                  ${
                    pathname === "/genres" &&
                    searchParams?.get("selected") === genre.id.toString()
                      ? "ring-2 ring-white/50"
                      : "hover:ring-1 hover:ring-white/20"
                  }`}
                  onClick={onClose}
                >
                  <span className="text-2xl group-hover:scale-110 transition-transform">
                    {genre.icon}
                  </span>
                  <div className="space-y-1">
                    <h3 className="font-medium text-white">{genre.name}</h3>
                    <p className="text-xs text-white/70 line-clamp-1">
                      {genre.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            {/* Popular Categories */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-gray-400">
                Popular Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {genreData.slice(3, 5).flatMap(({ genres }) =>
                  genres.map((genre) => (
                    <Link
                      key={genre.id}
                      href={`/genres?selected=${genre.id}`}
                      className="px-3 py-1.5 text-sm text-gray-300 bg-gray-800/50 
                      rounded-full hover:bg-gray-800 hover:text-white transition-colors"
                      onClick={onClose}
                    >
                      {genre.icon} {genre.name}
                    </Link>
                  ))
                )}
              </div>
            </div>

            {/* Explore All Button */}
            <Link
              href="/genres"
              className="block text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 
              text-white rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all 
              duration-300 font-medium group"
              onClick={onClose}
            >
              Explore All Genres
              <motion.span
                className="inline-block ml-2"
                animate={{ x: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                →
              </motion.span>
            </Link>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function NavbarContent() {
  const pathname = usePathname();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isGenresOpen, setIsGenresOpen] = useState(false);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsGenresOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setQuery("");
      setIsSearchOpen(false);
    }
  };

  return (
    <nav className="bg-black/90 backdrop-blur-md sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-600 
            bg-clip-text text-transparent hover:from-blue-400 hover:to-purple-500 
            transition-all duration-300"
          >
            MovieApp
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-2 rounded-md text-sm font-medium 
                transition-colors duration-200 hover:text-white
                ${pathname === href ? "text-white" : "text-gray-300"}`}
              >
                {label}
                {pathname === href && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 to-purple-600"
                    initial={false}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}

            {/* Genres Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsGenresOpen(!isGenresOpen)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium 
                transition-colors duration-200 hover:text-white
                ${isGenresOpen ? "text-white" : "text-gray-300"}`}
              >
                Genres
                <FaChevronDown
                  className={`transition-transform duration-200 ${
                    isGenresOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              <GenreDropdown
                isOpen={isGenresOpen}
                onClose={() => setIsGenresOpen(false)}
              />
            </div>
          </div>

          {/* Search and Mobile Menu */}
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {isSearchOpen && (
                <motion.form
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="relative max-w-[200px] md:max-w-[300px]"
                  onSubmit={handleSearch}
                >
                  <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search..."
                    className="w-full px-4 py-1.5 pl-10 bg-gray-800/50 text-white rounded-full
                    border border-gray-700 focus:outline-none focus:border-blue-500
                    focus:ring-1 focus:ring-blue-500 transition-all text-sm"
                    autoFocus
                  />
                  <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                </motion.form>
              )}
            </AnimatePresence>

            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle search"
            >
              {isSearchOpen ? <FaTimes size={18} /> : <FaSearch size={18} />}
            </button>

            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden overflow-hidden"
            >
              <div className="py-2 space-y-1">
                {navItems.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className={`block px-4 py-2 text-sm rounded-md transition-colors
                    ${
                      pathname === href
                        ? "bg-gray-800 text-white"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
                {/* Mobile Genres */}
                <div className="px-4 py-2">
                  <div className="text-sm font-medium text-gray-400 mb-2">
                    Genres
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {genreData.flatMap(({ genres }) =>
                      genres.map((genre) => (
                        <Link
                          key={genre.id}
                          href={`/genres?selected=${genre.id}`}
                          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm 
                          text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                        >
                          <span>{genre.icon}</span>
                          {genre.name}
                        </Link>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

export default function Navbar() {
  return (
    <Suspense fallback={null}>
      <NavbarContent />
    </Suspense>
  );
}

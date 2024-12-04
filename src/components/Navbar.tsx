"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { genreData } from "@/utils/constants";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const pathname = usePathname();
  const [showGenres, setShowGenres] = useState(false);
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="text-2xl font-bold bg-gradient-to-r from-red-500 via-purple-500 to-blue-500 
              text-transparent bg-clip-text hover:from-blue-500 hover:via-purple-500 hover:to-red-500 
              transition-all duration-500"
            >
              Crackle
            </motion.div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === "/"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Home
            </Link>

            {/* Genres Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowGenres(true)}
              onMouseLeave={() => setShowGenres(false)}
            >
              <Link
                href="/genres"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === "/genres"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Genres
              </Link>

              <AnimatePresence>
                {showGenres && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute left-0 top-full mt-1 w-[280px] 
                    bg-gray-900/95 backdrop-blur-xl rounded-xl overflow-hidden 
                    shadow-xl border border-white/10"
                    style={{ transformOrigin: "top" }}
                  >
                    <div className="p-2 grid gap-1">
                      {genreData.map(({ category, genres }) => (
                        <div key={category} className="space-y-1">
                          <div className="px-2 py-1.5">
                            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                              {category}
                            </p>
                          </div>
                          {genres.map((genre) => (
                            <Link
                              key={genre.id}
                              href={`/genres?selected=${genre.id}`}
                              className="flex items-center gap-3 px-2 py-1.5 rounded-lg 
                              hover:bg-white/10 transition-colors group"
                            >
                              <div
                                className={`w-8 h-8 rounded-lg ${genre.color} flex items-center 
                                justify-center group-hover:scale-110 transition-transform`}
                              >
                                <span className="text-lg">{genre.icon}</span>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-white">
                                  {genre.name}
                                </p>
                                <p className="text-xs text-gray-400 line-clamp-1">
                                  {genre.description}
                                </p>
                              </div>
                            </Link>
                          ))}
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link
              href="/search"
              className={`px-4 py-2 rounded-lg transition-colors ${
                pathname === "/search"
                  ? "text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Search
            </Link>

            {user ? (
              <Link
                href="/profile"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === "/profile"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Profile
              </Link>
            ) : (
              <Link
                href="/login"
                className={`px-4 py-2 rounded-lg transition-colors ${
                  pathname === "/login"
                    ? "text-white"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

"use client";

import { useAuth } from "@/contexts/AuthContext";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaUser,
  FaSignOutAlt,
  FaChevronDown,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { dropdownGenres } from "@/utils/genre";
import { navLinks } from "@/utils/links";
import SearchBar from "./SearchBar";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [showGenres, setShowGenres] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isActive = (path: string) =>
    pathname === path
      ? "text-blue-500"
      : "text-gray-300 hover:text-white transition-colors";

  const handleGenreClick = (genreId: number) => {
    setShowGenres(false);
    setIsMobileMenuOpen(false);
    router.push(`/genres?selected=${genreId}`);
  };

  const handleExploreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowGenres(false);
    setIsMobileMenuOpen(false);
    router.push("/genres");
  };

  return (
    <nav className="bg-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link
              href="/home"
              className="text-2xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 
              text-transparent bg-clip-text hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 
              transition-all duration-300"
            >
              Crackle
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={isActive(link.href)}
                >
                  {link.label}
                </Link>
              ))}
              <div
                className="relative"
                onMouseEnter={() => setShowGenres(true)}
                onMouseLeave={() => setShowGenres(false)}
              >
                <button
                  className={`flex items-center gap-2 ${isActive("/genres")}`}
                >
                  Genres
                  <motion.span
                    animate={{ rotate: showGenres ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FaChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {showGenres && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 w-[480px] mt-6
                      bg-gray-950 backdrop-blur-xl rounded-2xl border border-gray-800
                      shadow-xl shadow-black/20 overflow-hidden"
                      style={{ transformOrigin: "top center" }}
                    >
                      <div
                        className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 
                        bg-gray-950 border-l border-t border-gray-800 rotate-45"
                      />
                      {/* Genre dropdown content */}
                      <div className="p-6 grid grid-cols-2 gap-6">
                        {dropdownGenres.map((category, idx) => (
                          <motion.div
                            key={category.category}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.2 }}
                            className="space-y-4"
                          >
                            <h3 className="text-sm font-medium text-gray-500 px-2 flex items-center gap-3">
                              <div className="h-px flex-1 bg-gradient-to-r from-gray-800" />
                              <span className="flex-shrink-0">
                                {category.category}
                              </span>
                              <div className="h-px flex-1 bg-gradient-to-l from-gray-800" />
                            </h3>
                            <div className="space-y-3">
                              {category.genres.map((genre) => (
                                <div
                                  key={genre.id}
                                  onClick={() => handleGenreClick(genre.id)}
                                  className="cursor-pointer"
                                >
                                  <motion.div
                                    whileHover={{ x: 4, scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    transition={{ duration: 0.3 }}
                                    className={`p-4 rounded-xl bg-gradient-to-br ${genre.color} 
                                    hover:bg-opacity-90 transition-all duration-300 
                                    flex items-center gap-5 group relative overflow-hidden`}
                                  >
                                    <span
                                      className="w-12 h-12 flex items-center justify-center 
                                      bg-black/30 rounded-xl text-2xl group-hover:scale-110 
                                      transition-transform duration-300 backdrop-blur-sm"
                                    >
                                      {genre.icon}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-base font-medium text-gray-100 mb-1">
                                        {genre.name}
                                      </div>
                                      <div className="text-sm text-gray-300 line-clamp-1">
                                        {genre.description}
                                      </div>
                                    </div>
                                  </motion.div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      <div
                        onClick={handleExploreClick}
                        className="p-5 bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950 
                        border-t border-gray-800 hover:from-blue-900 hover:via-blue-800 
                        hover:to-blue-900 transition-all duration-300 text-center
                        flex items-center justify-center gap-3 group cursor-pointer"
                      >
                        <span
                          className="text-sm font-medium text-gray-200 
                          group-hover:text-white transition-all duration-300"
                        >
                          Explore All Genres
                        </span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="text-gray-300 group-hover:text-white"
                        >
                          →
                        </motion.span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Desktop Search and Auth */}
          <div className="hidden md:flex items-center gap-6">
            <SearchBar />
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-gray-300">{user.name || user.email}</span>
                <button
                  onClick={logout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white 
                  transition-colors"
                >
                  <FaSignOutAlt />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-300 hover:text-white 
                  transition-colors"
                >
                  <FaUser />
                  Login
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                  transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-300 hover:text-white"
          >
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
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
              <div className="py-4 space-y-4">
                <SearchBar isMobile />
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`block px-4 py-2 ${isActive(link.href)}`}
                  >
                    {link.label}
                  </Link>
                ))}
                <button
                  onClick={() => setShowGenres(!showGenres)}
                  className={`w-full text-left px-4 py-2 flex items-center justify-between ${isActive(
                    "/genres"
                  )}`}
                >
                  Genres
                  <FaChevronDown
                    className={`transform transition-transform duration-200 ${
                      showGenres ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showGenres && (
                  <div className="bg-gray-900/50 rounded-lg mx-4 overflow-hidden">
                    {dropdownGenres.map((category) => (
                      <div key={category.category} className="py-2">
                        {category.genres.map((genre) => (
                          <button
                            key={genre.id}
                            onClick={() => handleGenreClick(genre.id)}
                            className="w-full px-4 py-2 text-left text-gray-300 hover:text-white 
                            hover:bg-gray-800/50 transition-colors"
                          >
                            {genre.name}
                          </button>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
                {user ? (
                  <div className="px-4 pt-4 border-t border-gray-800">
                    <div className="text-gray-300 mb-2">
                      {user.name || user.email}
                    </div>
                    <button
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-2 text-red-500 hover:text-red-400"
                    >
                      <FaSignOutAlt />
                      Logout
                    </button>
                  </div>
                ) : (
                  <div className="px-4 pt-4 border-t border-gray-800 space-y-2">
                    <Link
                      href="/auth/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-gray-300 hover:text-white"
                    >
                      <FaUser />
                      Login
                    </Link>
                    <Link
                      href="/auth/signup"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="block w-full px-4 py-2 text-center bg-blue-600 text-white 
                      rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Sign up
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}

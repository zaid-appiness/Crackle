"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaSearch } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { useDebounce } from "@/hooks/useDebounce";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { useAuth } from "@/contexts/AuthContext";

interface SearchBarProps {
  isMobile?: boolean;
}

export default function SearchBar({ isMobile }: SearchBarProps) {
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [showResults, setShowResults] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const debouncedQuery = useDebounce(query, 500);

  const { data: searchResults } = useQuery({
    queryKey: ["search", debouncedQuery],
    queryFn: () => movieApi.searchMovies(debouncedQuery),
    enabled: debouncedQuery.length > 2 && !!user,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultsRef.current &&
        !resultsRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push("/auth/login?message=Please login to search movies");
      return;
    }
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowResults(false);
      setQuery("");
    }
  };

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
    setShowResults(false);
    setQuery("");
  };

  const handleFocus = () => {
    if (!user) {
      router.push("/auth/login?message=Please login to search movies");
      return;
    }
    setShowResults(true);
  };

  return (
    <div className={`relative ${isMobile ? "px-4" : ""}`}>
      <form onSubmit={handleSearch} className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            if (!user) return;
            setQuery(e.target.value);
            setShowResults(true);
          }}
          onFocus={handleFocus}
          placeholder={user ? "Search movies..." : "Login to search movies"}
          className={`${
            isMobile ? "w-full" : "w-56"
          } px-4 py-1.5 pl-9 bg-gray-800/50 backdrop-blur-sm text-white rounded-lg 
          focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all text-sm
          ${!user && "cursor-pointer"}`}
          readOnly={!user}
        />
        <button
          type="submit"
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
        >
          <FaSearch className="text-sm" />
        </button>
      </form>

      <AnimatePresence>
        {showResults &&
          user &&
          debouncedQuery.length > 2 &&
          searchResults?.results && (
            <motion.div
              ref={resultsRef}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className={`absolute top-full mt-2 ${
                isMobile ? "left-4 right-4" : "w-[350px] right-0"
              } max-h-[70vh] overflow-y-auto bg-gray-900/95 backdrop-blur-sm rounded-xl 
            shadow-xl border border-gray-800/50`}
            >
              {searchResults.results.length > 0 ? (
                <div className="py-2">
                  {searchResults.results.slice(0, 5).map((movie: Movie) => (
                    <motion.div
                      key={movie.id}
                      className="px-4 py-2 hover:bg-gray-800/50 cursor-pointer flex items-center gap-3"
                      onClick={() => handleMovieClick(movie.id)}
                      whileHover={{ x: 5 }}
                    >
                      <div className="relative w-10 h-14 flex-shrink-0">
                        <Image
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                          alt={movie.title}
                          fill
                          className="object-cover rounded-md"
                          priority
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-white text-sm truncate">
                          {movie.title}
                        </h3>
                        <p className="text-xs text-gray-400">
                          {new Date(movie.release_date).getFullYear()}
                        </p>
                      </div>
                    </motion.div>
                  ))}
                  {searchResults.results.length > 5 && (
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={handleSearch}
                      className="w-full px-4 py-2 text-xs text-blue-400 hover:text-blue-300 text-center"
                    >
                      View all {searchResults.results.length} results
                    </motion.button>
                  )}
                </div>
              ) : (
                <div className="px-4 py-6 text-center text-gray-400 text-sm">
                  No results found for &quot;{debouncedQuery}&quot;
                </div>
              )}
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}

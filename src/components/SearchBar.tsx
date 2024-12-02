"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types/movie";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 2) {
      setIsSearching(true);
      try {
        const data = await movieApi.searchMovies(value);
        setResults(data.results.slice(0, 5));
      } catch (error) {
        console.error("Search error:", error);
      }
      setIsSearching(false);
    } else {
      setResults([]);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-4"
    >
      <div className="relative max-w-xs">
        <motion.div
          className="relative flex items-center"
          whileHover={{ scale: 1.02 }}
        >
          <FiSearch className="absolute left-3 text-gray-400" size={20} />
          <input
            type="text"
            value={query}
            onChange={handleSearch}
            placeholder="Search movies..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 border border-gray-700 
            text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 
            focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </motion.div>

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-gray-800 rounded-lg 
              shadow-lg overflow-hidden z-50 border border-gray-700"
            >
              {results.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                  className="p-3 cursor-pointer border-b border-gray-700 last:border-b-0"
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <h3 className="font-medium text-white">{movie.title}</h3>
                  <p className="text-sm text-gray-400">
                    {new Date(movie.release_date).getFullYear()}
                  </p>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {isSearching && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

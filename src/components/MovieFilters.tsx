"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaTimes } from "react-icons/fa";
import { genres } from "@/utils/constants";

export interface FilterState {
  rating: number;
  genre: number | null;
}

interface MovieFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onFilterReset: () => void;
  initialFilters?: FilterState;
}

export default function MovieFilters({
  onFilterChange,
  onFilterReset,
  initialFilters = { rating: 0, genre: null },
}: MovieFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);

  const handleRatingChange = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleGenreChange = (genreId: number | null) => {
    const newFilters = { ...filters, genre: genreId };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({ rating: 0, genre: null });
    onFilterReset();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 sm:px-4 py-2 text-sm text-gray-300 hover:text-white 
        transition-colors bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700/50 
        hover:border-gray-600/50"
      >
        <FaFilter className="text-sm sm:text-base" />
        <span className="hidden sm:inline">Filters</span>
        {(filters.rating > 0 || filters.genre !== null) && (
          <span
            className="inline-flex items-center justify-center w-5 h-5 text-xs bg-blue-500 
          text-white rounded-full"
          >
            {(filters.rating > 0 ? 1 : 0) + (filters.genre !== null ? 1 : 0)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="fixed md:absolute left-4 right-4 md:left-auto md:right-0 top-24 md:top-full 
              mt-2 p-4 bg-gray-900/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-800/50 
              z-50 md:w-[320px]"
              style={{ transformOrigin: "top right" }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              <div className="space-y-6">
                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Minimum Rating
                  </label>
                  <div className="flex items-center gap-2">
                    {[0, 5, 6, 7, 8, 9].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => handleRatingChange(rating)}
                        className={`flex-1 px-2 py-1.5 text-sm rounded-md transition-colors ${
                          filters.rating === rating
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50"
                        }`}
                      >
                        {rating === 0 ? "All" : `${rating}+`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Genre
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      onClick={() => handleGenreChange(null)}
                      className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                        filters.genre === null
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50"
                      }`}
                    >
                      All
                    </button>
                    {genres.map((genre) => (
                      <button
                        key={genre.id}
                        onClick={() => handleGenreChange(genre.id)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors truncate ${
                          filters.genre === genre.id
                            ? "bg-blue-600 text-white"
                            : "bg-gray-800/50 text-gray-300 hover:text-white hover:bg-gray-700/50"
                        }`}
                      >
                        {genre.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Reset Button */}
                {(filters.rating > 0 || filters.genre !== null) && (
                  <button
                    onClick={handleReset}
                    className="w-full px-4 py-2 text-sm bg-gray-800/50 text-red-400 rounded-lg 
                    hover:bg-gray-700/50 transition-colors"
                  >
                    Reset Filters
                  </button>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

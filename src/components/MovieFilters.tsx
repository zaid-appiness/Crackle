"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaStar, FaFire, FaTheaterMasks } from "react-icons/fa";
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

const popularGenres = [28, 12, 35, 18, 27, 10749];

const genreGradients = {
  28: "from-red-600 to-orange-600",
  12: "from-green-600 to-emerald-600",
  35: "from-yellow-600 to-amber-600",
  18: "from-blue-600 to-indigo-600",
  27: "from-purple-600 to-fuchsia-600",
  10749: "from-pink-600 to-rose-600",
};

export default function MovieFilters({
  onFilterChange,
  onFilterReset,
  initialFilters = { rating: 0, genre: null },
}: MovieFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);
  const filterRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 300); // Small delay to prevent accidental closing
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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

  const isFiltersActive = filters.rating > 0 || filters.genre !== null;

  return (
    <div
      ref={filterRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all cursor-pointer
        ${
          isFiltersActive
            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
      >
        <FaFilter
          className={isFiltersActive ? "text-white" : "text-gray-400"}
        />
        <span>Filters</span>
        {isFiltersActive && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="flex items-center justify-center w-5 h-5 text-xs bg-white text-blue-600 rounded-full"
          >
            {(filters.rating > 0 ? 1 : 0) + (filters.genre !== null ? 1 : 0)}
          </motion.span>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            onMouseEnter={() => {
              if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
              }
            }}
            onMouseLeave={handleMouseLeave}
            className="absolute right-0 mt-2 w-96 bg-gray-900/95 backdrop-blur-md rounded-xl 
            shadow-xl border border-gray-800 overflow-hidden z-50"
          >
            <div className="p-6 space-y-8 overflow-y-auto custom-scrollbar max-h-[calc(100vh-200px)]">
              {/* Rating Filter */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaStar className="text-yellow-500 text-xl" />
                  <span className="text-base font-medium">Rating</span>
                </div>
                <div className="flex items-center justify-between px-4">
                  {[...Array(5)].map((_, index) => {
                    const rating = (index + 1) * 2;
                    const isSelected = filters.rating >= rating;
                    const isHovered =
                      hoveredRating !== null && rating <= hoveredRating;

                    return (
                      <motion.button
                        key={rating}
                        whileHover={{ scale: 1.2 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleRatingChange(rating)}
                        onMouseEnter={() => setHoveredRating(rating)}
                        onMouseLeave={() => setHoveredRating(null)}
                        className="relative group"
                      >
                        <motion.div
                          animate={{
                            scale: isSelected || isHovered ? [1, 1.2, 1] : 1,
                            rotate: isSelected ? [0, 15, 0] : 0,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <FaStar
                            className={`text-4xl transition-colors duration-300 ${
                              isSelected
                                ? "text-yellow-500"
                                : isHovered
                                ? "text-yellow-500/70"
                                : "text-gray-600"
                            }`}
                          />
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{
                            opacity: isHovered ? 1 : 0,
                            y: isHovered ? 0 : 10,
                          }}
                          className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 
                          text-white text-xs py-1 px-2 rounded whitespace-nowrap"
                        >
                          {rating.toFixed(1)}+
                        </motion.div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Popular Genres */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaFire className="text-orange-500 text-xl" />
                    <span className="text-base font-medium">
                      Trending Genres
                    </span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenreChange(null)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Clear
                  </motion.button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {genres
                    .filter((genre) => popularGenres.includes(genre.id))
                    .map((genre) => {
                      const isSelected = filters.genre === genre.id;
                      return (
                        <motion.button
                          key={genre.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleGenreChange(isSelected ? null : genre.id)
                          }
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all
                          ${
                            isSelected
                              ? `bg-gradient-to-r ${
                                  genreGradients[
                                    genre.id as keyof typeof genreGradients
                                  ] || "from-purple-600 to-pink-600"
                                } text-white shadow-lg`
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          {genre.name}
                        </motion.button>
                      );
                    })}
                </div>
              </div>

              {/* All Genres */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaTheaterMasks className="text-purple-500 text-xl" />
                    <span className="text-base font-medium">All Genres</span>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleGenreChange(null)}
                    className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Clear
                  </motion.button>
                </div>
                <div className="grid grid-cols-2 gap-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                  {genres
                    .filter((genre) => !popularGenres.includes(genre.id))
                    .map((genre) => {
                      const isSelected = filters.genre === genre.id;
                      return (
                        <motion.button
                          key={genre.id}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() =>
                            handleGenreChange(isSelected ? null : genre.id)
                          }
                          className={`px-3 py-2 rounded-lg text-sm transition-all
                          ${
                            isSelected
                              ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg"
                              : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white"
                          }`}
                        >
                          {genre.name}
                        </motion.button>
                      );
                    })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {/* Explore All Genres */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => (window.location.href = "/genres")}
                  className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 
                  text-white rounded-lg hover:from-blue-500 hover:to-purple-500 
                  transition-all text-sm font-medium flex items-center justify-center gap-2 group"
                >
                  <FaTheaterMasks className="text-lg group-hover:rotate-12 transition-transform" />
                  Explore All Genres
                </motion.button>

                {/* Reset Button */}
                {isFiltersActive && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleReset}
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500/20 to-orange-500/20 
                    text-red-500 rounded-lg hover:from-red-500/30 hover:to-orange-500/30 
                    transition-all text-sm font-medium flex items-center justify-center gap-2 group"
                  >
                    <motion.span
                      animate={{ rotate: isFiltersActive ? [0, -360] : 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-lg"
                    >
                      ↺
                    </motion.span>
                    Reset Filters
                  </motion.button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

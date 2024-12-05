"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaStar, FaFire, FaTheaterMasks } from "react-icons/fa";
import { popularGenres, genreGradients, genres } from "@/utils/genre";
import { FilterState } from "@/types/filters";
import { useRouter } from "next/navigation";
import {
  FilterButton,
  ClearButton,
  ExploreButton,
  ResetButton,
} from "./FilterButton";
import StarRating from "./StarRating";

interface MovieFiltersProps {
  onFilterChange: (filters: FilterState) => void;
  onFilterReset: () => void;
  initialFilters?: FilterState;
}

export default function MovieFilters({
  onFilterChange,
  onFilterReset,
  initialFilters,
}: MovieFiltersProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    rating: initialFilters?.rating ?? 0,
    genres: initialFilters?.genres ?? [],
  });
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
    }, 300);
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

  const handleGenreChange = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId];

    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClearGenres = () => {
    const newFilters = { ...filters, genres: [] };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const isFiltersActive = filters.rating > 0 || filters.genres.length > 0;

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
            {(filters.rating > 0 ? 1 : 0) + (filters.genres.length > 0 ? 1 : 0)}
          </motion.span>
        )}
      </motion.div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-2 w-96 bg-gray-900/95 backdrop-blur-md rounded-xl 
            shadow-xl border border-gray-800 overflow-hidden z-50"
          >
            <div className="p-6 space-y-8">
              {/* Rating Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaStar className="text-yellow-500 text-xl" />
                  <span className="text-base font-medium">Rating</span>
                </div>
                <StarRating
                  value={filters.rating}
                  onChange={handleRatingChange}
                />
              </div>

              {/* Trending Genres */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-300">
                    <FaFire className="text-orange-500 text-xl" />
                    <span className="text-base font-medium">
                      Trending Genres
                    </span>
                  </div>
                  {filters.genres.length > 0 && (
                    <ClearButton onClick={handleClearGenres} />
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {genres
                    .filter((genre) => popularGenres.includes(genre.id))
                    .map((genre) => (
                      <FilterButton
                        key={genre.id}
                        onClick={() => handleGenreChange(genre.id)}
                        isSelected={filters.genres.includes(genre.id)}
                        gradient={
                          genreGradients[
                            genre.id as keyof typeof genreGradients
                          ] || "from-neutral-900 to-stone-800"
                        }
                      >
                        {genre.name}
                      </FilterButton>
                    ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <ExploreButton
                  onClick={() => router.push("/genres")}
                  icon={<FaTheaterMasks />}
                >
                  Explore All Genres
                </ExploreButton>

                <ResetButton
                  onClick={onFilterReset}
                  isActive={isFiltersActive}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilter,
  FaStar,
  FaFire,
  FaTheaterMasks,
  FaChevronDown,
} from "react-icons/fa";
import { popularGenres, genreGradients } from "@/utils/genre";
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

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  const handleRatingClick = (rating: number) => {
    const newFilters = { ...filters, rating };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleGenreClick = (genreId: number) => {
    const newGenres = filters.genres.includes(genreId)
      ? filters.genres.filter((id) => id !== genreId)
      : [...filters.genres, genreId];
    const newFilters = { ...filters, genres: newGenres };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setFilters({ rating: 0, genres: [] });
    onFilterReset();
  };

  const handleExploreClick = () => {
    router.push("/genres");
  };

  return (
    <div
      className="relative"
      ref={filterRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-800/50 transition-colors text-gray-300 hover:text-white">
        <FaFilter className="text-blue-400" />
        <span>Filters</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-gray-400"
        >
          <FaChevronDown />
        </motion.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-6 w-[320px] bg-gray-950 backdrop-blur-xl rounded-2xl border border-gray-800 shadow-xl shadow-black/20 overflow-hidden z-[100]"
            style={{ transformOrigin: "top right" }}
          >
            <div className="absolute -top-2 right-6 w-4 h-4 bg-gray-950 border-l border-t border-gray-800 rotate-45" />

            {/* Rating Section */}
            <div className="p-4 border-b border-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaStar className="text-yellow-500" />
                  <span>Rating</span>
                </div>
                {filters.rating > 0 && (
                  <ClearButton onClick={() => handleRatingClick(0)} />
                )}
              </div>
              <StarRating value={filters.rating} onChange={handleRatingClick} />
            </div>

            {/* Genres Section */}
            <div className="p-4 border-b border-gray-800/50">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2 text-gray-300">
                  <FaTheaterMasks className="text-purple-500" />
                  <span>Genres</span>
                </div>
                {filters.genres.length > 0 && (
                  <ClearButton
                    onClick={() => handleGenreClick(filters.genres[0])}
                  />
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                {popularGenres.map((genreId) => {
                  const genreNames: Record<number, string> = {
                    28: "Action",
                    12: "Adventure",
                    35: "Comedy",
                    18: "Drama",
                    27: "Horror",
                    10749: "Romance",
                  };
                  return (
                    <FilterButton
                      key={genreId}
                      onClick={() => handleGenreClick(genreId)}
                      isSelected={filters.genres.includes(genreId)}
                      gradient={
                        genreGradients[genreId as keyof typeof genreGradients]
                      }
                    >
                      {genreNames[genreId]}
                    </FilterButton>
                  );
                })}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-4 space-y-2">
              <ResetButton
                onClick={handleReset}
                isActive={filters.rating > 0 || filters.genres.length > 0}
              />
              <ExploreButton onClick={handleExploreClick} icon={<FaFire />}>
                Explore All Genres
              </ExploreButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

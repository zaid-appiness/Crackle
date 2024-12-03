"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaFilter, FaStar, FaTimes } from "react-icons/fa";
import { genres } from "@/utils/constants";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export interface FilterState {
  rating: number;
  genre: number | null;
}

export default function MovieFilters({ onFilterChange, onReset }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const [activeFilters, setActiveFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...activeFilters, ...newFilters };
    setActiveFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    setActiveFilters({ rating: 0, genre: null });
    onReset();
  };

  return (
    <div className="relative z-50" ref={filterRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-gray-800/80 to-gray-900/80 
        hover:from-gray-700/80 hover:to-gray-800/80 text-gray-300 rounded-xl transition-all duration-300 
        backdrop-blur-sm border border-gray-700/50 shadow-lg hover:shadow-gray-900/20"
      >
        <FaFilter
          className={`transition-all duration-300 ${
            activeFilters.rating > 0 || activeFilters.genre !== null
              ? "text-purple-500 rotate-180 scale-110"
              : "text-gray-400 group-hover:scale-110"
          }`}
        />
        <span className="hidden sm:inline">Filters</span>
        {(activeFilters.rating > 0 || activeFilters.genre !== null) && (
          <span
            className="flex items-center justify-center w-5 h-5 text-xs bg-purple-500 
          text-white rounded-full animate-pulse"
          >
            {(activeFilters.rating > 0 ? 1 : 0) + (activeFilters.genre ? 1 : 0)}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="fixed inset-x-4 bottom-4 sm:absolute sm:inset-auto sm:right-0 sm:top-full sm:mt-4 
            w-auto sm:w-[320px] md:w-[380px] bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-md 
            rounded-2xl shadow-xl border border-gray-700/50 overflow-hidden"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-white">Filters</h3>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1 text-gray-400 hover:text-white transition-colors"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  Minimum Rating
                  {activeFilters.rating > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 text-xs bg-yellow-500/20 text-yellow-500 rounded-full"
                    >
                      {activeFilters.rating}.0+
                    </motion.span>
                  )}
                </h3>
                <div className="flex gap-2 bg-gray-800/30 p-3 rounded-xl">
                  {[...Array(5)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        handleFilterChange({ rating: (index + 1) * 2 })
                      }
                      className="group relative flex-1 p-2"
                    >
                      <FaStar
                        className={`w-full h-full transition-all duration-300 transform 
                        ${
                          (index + 1) * 2 <= activeFilters.rating
                            ? "text-yellow-500 scale-110"
                            : "text-gray-600 group-hover:text-gray-500 group-hover:scale-110"
                        }`}
                      />
                      <span
                        className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-gray-800 
                      text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity 
                      whitespace-nowrap shadow-lg"
                      >
                        {(index + 1) * 2}.0+
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-400 mb-3 flex items-center gap-2">
                  Genre
                  {activeFilters.genre && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="px-2 py-0.5 text-xs bg-purple-500/20 text-purple-500 rounded-full"
                    >
                      {genres.find((g) => g.id === activeFilters.genre)?.name}
                    </motion.span>
                  )}
                </h3>
                <div
                  className="grid grid-cols-2 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto 
                pr-2 scrollbar-thin scrollbar-track-gray-800/50 scrollbar-thumb-gray-600/50"
                >
                  {genres.map((genre) => (
                    <button
                      key={genre.id}
                      onClick={() =>
                        handleFilterChange({
                          genre:
                            activeFilters.genre === genre.id ? null : genre.id,
                        })
                      }
                      className={`px-4 py-2.5 text-sm rounded-xl transition-all duration-300 transform 
                      hover:scale-[1.02] ${
                        activeFilters.genre === genre.id
                          ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium shadow-lg"
                          : "bg-gray-800/50 text-gray-400 hover:bg-gray-800 hover:text-white"
                      }`}
                    >
                      {genre.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Reset Button */}
              {(activeFilters.rating > 0 || activeFilters.genre !== null) && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  onClick={handleReset}
                  className="w-full mt-6 px-4 py-3 bg-gradient-to-r from-red-500/10 to-red-600/10 
                  text-red-500 rounded-xl hover:from-red-500/20 hover:to-red-600/20 hover:text-red-400 
                  transition-all duration-300 font-medium"
                >
                  Reset Filters
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

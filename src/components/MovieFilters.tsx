"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiFilter } from "react-icons/fi";

interface FilterProps {
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export interface FilterState {
  rating: number;
  genre: number | null;
}

const genres = [
  { id: 28, name: "Action" },
  { id: 12, name: "Adventure" },
  { id: 16, name: "Animation" },
  { id: 35, name: "Comedy" },
  { id: 80, name: "Crime" },
  { id: 18, name: "Drama" },
  { id: 14, name: "Fantasy" },
  { id: 27, name: "Horror" },
  { id: 10749, name: "Romance" },
  { id: 878, name: "Science Fiction" },
  { id: 53, name: "Thriller" },
];

export default function MovieFilters({ onFilterChange, onReset }: FilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  const handleReset = () => {
    setFilters({ rating: 0, genre: null });
    onReset();
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg 
        hover:bg-gray-700 transition-colors"
      >
        <FiFilter />
        Filters
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full mt-2 right-0 w-64 bg-gray-800 rounded-lg 
            shadow-lg p-4 z-50"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Filters</h3>
              <button
                onClick={handleReset}
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Reset
              </button>
            </div>

            {/* Rating Filter */}
            <div className="mb-4">
              <label className="block text-white text-sm mb-2">
                Minimum Rating: {filters.rating}
              </label>
              <input
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={filters.rating}
                onChange={(e) =>
                  handleFilterChange({ rating: parseFloat(e.target.value) })
                }
                className="w-full"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label className="block text-white text-sm mb-2">Genre</label>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {genres.map((genre) => (
                  <button
                    key={genre.id}
                    onClick={() =>
                      handleFilterChange({
                        genre: filters.genre === genre.id ? null : genre.id,
                      })
                    }
                    className={`w-full text-left px-3 py-2 rounded-md transition-colors ${
                      filters.genre === genre.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

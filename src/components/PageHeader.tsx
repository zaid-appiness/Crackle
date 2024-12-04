"use client";

import { motion } from "framer-motion";
import MovieFilters, { FilterState } from "./MovieFilters";

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  filters?: FilterState;
  showFilters?: boolean;
  onFilterChange?: (filters: FilterState) => void;
  onResetFilters?: () => void;
  initialFilters?: FilterState;
}

export default function PageHeader({
  title,
  subtitle,
  showFilters = true,
  onFilterChange,
  onResetFilters,
  initialFilters,
}: PageHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div className="space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white"
        >
          {title}
        </motion.h1>
        {subtitle && <p className="text-gray-400">{subtitle}</p>}
      </div>
      {showFilters && onFilterChange && onResetFilters && (
        <MovieFilters
          onFilterChange={onFilterChange}
          onFilterReset={onResetFilters}
          initialFilters={initialFilters}
        />
      )}
    </div>
  );
}

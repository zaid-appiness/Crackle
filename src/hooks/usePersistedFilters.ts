"use client";

import { useState } from "react";
import { FilterState } from "@/components/MovieFilters";

export function usePersistedFilters(pageKey: string) {
  const [filters, setFilters] = useState<FilterState>(() => {
    // Initialize from localStorage if available
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem(`filters_${pageKey}`);
      return saved ? JSON.parse(saved) : { rating: 0, genre: null };
    }
    return { rating: 0, genre: null };
  });

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    localStorage.setItem(`filters_${pageKey}`, JSON.stringify(newFilters));
  };

  const resetFilters = () => {
    const defaultFilters = { rating: 0, genre: null };
    setFilters(defaultFilters);
    localStorage.setItem(`filters_${pageKey}`, JSON.stringify(defaultFilters));
  };

  return {
    filters,
    setFilters: handleFilterChange,
    resetFilters,
  };
}

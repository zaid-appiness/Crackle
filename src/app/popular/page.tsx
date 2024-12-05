"use client";

import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import BasePageLayout from "@/components/BasePageLayout";
import { useMovieList } from "@/hooks/useMovieList";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";

export default function PopularPage() {
  const { page, handlePageChange } = useMovieList();
  const { filters, setFilters, resetFilters } = usePersistedFilters("popular");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => movieApi.getPopularMovies(page),
  });

  const filteredMovies = data?.results
    ? filterMovies(data.results, filters)
    : [];
  const totalPages = Math.min(data?.total_pages ?? 0, 500);

  return (
    <BasePageLayout
      title="Popular Movies"
      subtitle="Most watched movies"
      movies={filteredMovies}
      isLoading={isLoading}
      prefix="popular"
      page={page}
      totalPages={totalPages}
      filters={filters}
      onFilterChange={setFilters}
      onResetFilters={resetFilters}
      onPageChange={handlePageChange}
    />
  );
}

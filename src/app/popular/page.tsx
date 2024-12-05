"use client";

import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import MovieGrid from "@/components/MovieGrid";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";
import NoResults from "@/components/NoResults";
import PageHeader from "@/components/PageHeader";
import PageHeaderSkeleton from "@/components/PageHeaderSkeleton";
import Pagination from "@/components/Pagination";
import PaginationSkeleton from "@/components/PaginationSkeleton";
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

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHeaderSkeleton />
        <MovieGridSkeleton />
        <PaginationSkeleton />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Popular Movies"
        subtitle="Most watched movies"
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={resetFilters}
        initialFilters={filters}
      />

      {!filteredMovies?.length ? (
        <NoResults />
      ) : (
        <>
          <MovieGrid movies={filteredMovies} prefix="popular" />
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
}

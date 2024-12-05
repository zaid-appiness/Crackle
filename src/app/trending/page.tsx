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
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";
import { useMovieList } from "@/hooks/useMovieList";

export default function TrendingPage() {
  const { page, handlePageChange } = useMovieList();
  const { filters, setFilters, resetFilters } = usePersistedFilters("trending");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "trending", page],
    queryFn: () => movieApi.getTrendingMovies(page),
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
        title="Trending Now"
        subtitle="What everyone's watching"
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={resetFilters}
        initialFilters={filters}
      />

      {!filteredMovies?.length ? (
        <NoResults onReset={resetFilters} />
      ) : (
        <>
          <MovieGrid movies={filteredMovies} prefix="trending" />
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

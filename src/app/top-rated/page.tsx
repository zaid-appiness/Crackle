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

export default function TopRatedPage() {
  const { page, handlePageChange } = useMovieList();
  const { filters, setFilters, resetFilters } =
    usePersistedFilters("top-rated");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "top-rated", page],
    queryFn: () => movieApi.getTopRatedMovies(page),
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
        title="Top Rated Movies"
        subtitle="Highest rated movies of all time"
        filters={filters}
        onFilterChange={setFilters}
        onResetFilters={resetFilters}
        initialFilters={filters}
      />

      {!filteredMovies?.length ? (
        <NoResults onReset={resetFilters} />
      ) : (
        <>
          <MovieGrid movies={filteredMovies} prefix="top-rated" />
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

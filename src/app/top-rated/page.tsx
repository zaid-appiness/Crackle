"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import PageHeader from "@/components/PageHeader";
import { useMovieList } from "@/hooks/useMovieList";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";
import Pagination from "@/components/Pagination";

function TopRatedPageContent() {
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

  if (isLoading) return <Loading />;

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

export default function TopRatedPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TopRatedPageContent />
    </Suspense>
  );
}

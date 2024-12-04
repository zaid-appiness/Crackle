"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { useMovieList } from "@/hooks/useMovieList";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";

function PopularPageContent() {
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

  if (isLoading) return <Loading />;

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

export default function PopularPage() {
  return (
    <Suspense fallback={<Loading />}>
      <PopularPageContent />
    </Suspense>
  );
}

"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import PageHeader from "@/components/PageHeader";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";
import { useMovieList } from "@/hooks/useMovieList";
import Pagination from "@/components/Pagination";

function TrendingPageContent() {
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

  if (isLoading) return <Loading />;

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

export default function TrendingPage() {
  return (
    <Suspense fallback={<Loading />}>
      <TrendingPageContent />
    </Suspense>
  );
}

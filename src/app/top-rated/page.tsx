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

function TopRatedPageContent() {
  const { page } = useMovieList();
  const { filters, setFilters, resetFilters } =
    usePersistedFilters("top-rated");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "top-rated", page],
    queryFn: () => movieApi.getTopRatedMovies(),
  });

  const filteredMovies = data?.results
    ? filterMovies(data.results, filters)
    : [];

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Top 10 Movies"
        subtitle="Highest rated movies of all time"
        onFilterChange={setFilters}
        onFilterReset={resetFilters}
        initialFilters={filters}
      />

      {!filteredMovies?.length ? (
        <NoResults />
      ) : (
        <MovieGrid movies={filteredMovies} prefix="top-rated" />
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

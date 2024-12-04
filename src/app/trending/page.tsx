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

function TrendingPageContent() {
  const { filters, setFilters, resetFilters } = usePersistedFilters("trending");

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => movieApi.getTrendingMovies(),
  });

  const filteredMovies = data?.results
    ? filterMovies(data.results, filters)
    : [];

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <PageHeader
        title="Trending Now"
        subtitle="What everyone's watching"
        onFilterChange={setFilters}
        onFilterReset={resetFilters}
        initialFilters={filters}
      />

      {!filteredMovies?.length ? (
        <NoResults />
      ) : (
        <MovieGrid movies={filteredMovies} prefix="trending" />
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

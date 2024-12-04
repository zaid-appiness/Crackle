"use client";

import { Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { movieApi } from "@/lib/api";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import { useState } from "react";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";
import NoResults from "@/components/NoResults";
import MovieGrid from "@/components/MovieGrid";
import { Movie } from "@/types/movie";

function SearchPageContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => movieApi.searchMovies(query),
    enabled: query.length > 0,
  });

  const filteredMovies = data?.results.filter((movie: Movie) => {
    const passesRating = movie.vote_average >= filters.rating;
    const passesGenre =
      !filters.genre || movie.genre_ids.includes(filters.genre);
    return passesRating && passesGenre;
  });

  if (isLoading) return <MovieGridSkeleton />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white"
        >
          Search Results for &quot;{query}&quot;
        </motion.h1>
        <MovieFilters
          onFilterChange={setFilters}
          onReset={() => setFilters({ rating: 0, genre: null })}
        />
      </div>

      {!filteredMovies?.length ? (
        <NoResults
          message="No movies found"
          subMessage={`No results found for "${query}". Try a different search term.`}
        />
      ) : (
        <MovieGrid movies={filteredMovies} prefix="search" />
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<MovieGridSkeleton />}>
      <SearchPageContent />
    </Suspense>
  );
}

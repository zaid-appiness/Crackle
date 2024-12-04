"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import { useState } from "react";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import NoResults from "@/components/NoResults";
import MovieGrid from "@/components/MovieGrid";
import { Movie } from "@/types/movie";

export default function TrendingPage() {
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => movieApi.getTrendingMovies(),
  });

  const filteredMovies = data?.results.filter((movie: Movie) => {
    const passesRating = movie.vote_average >= filters.rating;
    const passesGenre =
      !filters.genre || movie.genre_ids.includes(filters.genre);
    return passesRating && passesGenre;
  });

  if (isLoading) return <Loading />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-white"
        >
          Trending Now
        </motion.h1>
        <MovieFilters
          onFilterChange={setFilters}
          onReset={() => setFilters({ rating: 0, genre: null })}
        />
      </div>

      {!filteredMovies?.length ? (
        <NoResults />
      ) : (
        <MovieGrid movies={filteredMovies} prefix="trending" />
      )}
    </div>
  );
}

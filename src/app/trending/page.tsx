"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import { generateId } from "@/utils/generateId";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import NoResults from "@/components/NoResults";

export default function TrendingPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => movieApi.getTrendingMovies(),
  });

  const filteredMovies = data?.results.filter((movie) => {
    const passesRating = movie.vote_average >= filters.rating;
    const passesGenre =
      !filters.genre || movie.genre_ids.includes(filters.genre);
    return passesRating && passesGenre;
  });

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const movieCard = target.closest("[data-movie-id]");
    if (movieCard) {
      const movieId = movieCard.getAttribute("data-movie-id");
      router.push(`/movie/${movieId}`);
    }
  };

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
        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          onClick={handleContainerClick}
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: { staggerChildren: 0.1 },
            },
          }}
          initial="hidden"
          animate="show"
        >
          {filteredMovies.map((movie, index) => (
            <motion.div
              key={generateId("trending-movie", movie.id, index)}
              className="relative"
              data-movie-id={movie.id}
            >
              <MovieCard movie={movie} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

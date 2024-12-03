"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import { generateId } from "@/utils/generateId";
import { useState } from "react";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import { useRouter } from "next/navigation";
import NoResults from "@/components/NoResults";

export default function TopRatedPage() {
  const router = useRouter();
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "top-rated"],
    queryFn: () => movieApi.getTopRatedMovies(),
  });

  const filteredMovies = data?.results.slice(0, 10).filter((movie) => {
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
          Top 10 Movies
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
          className="grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
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
              key={generateId("top-movie", movie.id, index)}
              className="relative"
              data-movie-id={movie.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0 },
              }}
            >
              <div
                className="absolute -left-4 -top-4 w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 
              rounded-full flex items-center justify-center z-10 shadow-lg border-2 border-white/10"
              >
                <span className="text-white font-bold">{index + 1}</span>
              </div>
              <MovieCard movie={movie} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

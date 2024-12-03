"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import { movieApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import { generateId } from "@/utils/generateId";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import { useState } from "react";

export default function SearchPage() {
  const router = useRouter();
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
          Search Results for &quot;{query}&quot;
        </motion.h1>
        <MovieFilters
          onFilterChange={setFilters}
          onReset={() => setFilters({ rating: 0, genre: null })}
        />
      </div>

      {data?.results.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-xl text-center my-12"
        >
          No results found for &quot;{query}&quot;
        </motion.p>
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
          {data?.results
            .filter((movie) => {
              const passesRating = movie.vote_average >= filters.rating;
              const passesGenre =
                !filters.genre || movie.genre_ids.includes(filters.genre);
              return passesRating && passesGenre;
            })
            .map((movie, index) => (
              <motion.div
                key={generateId("search-movie", movie.id, index)}
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

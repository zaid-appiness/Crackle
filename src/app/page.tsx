"use client";

import { Suspense, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import Hero from "@/components/Hero";
import { generateId } from "@/utils/generateId";

export default function Home() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [featuredMovie, setFeaturedMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingData, popularData] = await Promise.all([
          movieApi.getTrendingMovies(),
          movieApi.getPopularMovies(),
        ]);
        setFeaturedMovie(trendingData.results[0]);
        setMovies(popularData.results);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, []);

  if (!featuredMovie) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <Hero movie={featuredMovie} />

      <div className="container mx-auto px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-6"
        >
          Popular Movies
        </motion.h2>

        <motion.div
          className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          <Suspense fallback={<Loading />}>
            {movies?.map((movie, index) => (
              <motion.div
                key={generateId("home-movie", movie.id, index)}
                className="relative"
              >
                <MovieCard movie={movie} index={index} />
              </motion.div>
            ))}
          </Suspense>
        </motion.div>
      </div>
    </motion.div>
  );
}

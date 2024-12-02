"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";

export default function HomePage() {
  const [trendingMovies, setTrendingMovies] = useState<Movie[]>([]);
  const [topRatedMovies, setTopRatedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const [trendingData, topRatedData] = await Promise.all([
          movieApi.getTrendingMovies(),
          movieApi.getTopRatedMovies(),
        ]);

        setTrendingMovies(trendingData.results.slice(0, 5));
        setTopRatedMovies(topRatedData.results.slice(0, 10));
      } catch (error) {
        console.error("Error fetching movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, []);

  if (loading) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0"
        >
          {trendingMovies[0] && (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10" />
              <img
                src={`https://image.tmdb.org/t/p/original${trendingMovies[0].backdrop_path}`}
                alt={trendingMovies[0].title}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 p-8 z-20">
                <h1 className="text-5xl font-bold text-white mb-4">
                  {trendingMovies[0].title}
                </h1>
                <p className="text-gray-200 max-w-2xl">
                  {trendingMovies[0].overview}
                </p>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Trending Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Trending Now</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {trendingMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Top Rated Section */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold text-white">Top Rated</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {topRatedMovies.map((movie, index) => (
            <motion.div
              key={movie.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MovieCard movie={movie} />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

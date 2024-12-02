"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";

export default function PopularPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => setPage((prev) => prev + 1);

  useInfiniteScroll(loadMore, hasMore, loading);

  useEffect(() => {
    const fetchMovies = async () => {
      setLoading(true);
      try {
        const data = await movieApi.getPopularMovies(page);
        if (page === 1) {
          setMovies(data.results);
        } else {
          setMovies((prev) => [...prev, ...data.results]);
        }
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  if (loading && page === 1) return <Loading />;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <motion.h1
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-4xl font-bold text-white"
      >
        Popular Movies
      </motion.h1>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
      >
        {movies.map((movie, index) => (
          <motion.div
            key={`${movie.id}-${index}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <MovieCard movie={movie} />
          </motion.div>
        ))}
      </motion.div>

      {loading && page > 1 && (
        <div className="flex justify-center py-8">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </motion.div>
  );
}

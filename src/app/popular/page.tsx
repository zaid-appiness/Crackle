"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { movieApi } from "@/lib/api";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { generateId } from "@/utils/generateId";

export default function PopularPage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loadMore = () => {
    if (!loadingMore && hasMore) {
      setPage((prev) => prev + 1);
      setLoadingMore(true);
    }
  };

  useInfiniteScroll(loadMore, hasMore, loadingMore);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieApi.getPopularMovies(page);
        if (page === 1) {
          setMovies(data.results);
          setLoading(false);
        } else {
          setMovies((prev) => [...prev, ...data.results]);
          setLoadingMore(false);
        }
        setHasMore(data.page < data.total_pages);
      } catch (error) {
        console.error("Error fetching popular movies:", error);
        setLoading(false);
        setLoadingMore(false);
      }
    };

    fetchMovies();
  }, [page]);

  if (loading) return <Loading />;

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
            key={generateId("popular-movie", movie.id, index)}
            className="relative"
          >
            <MovieCard movie={movie} index={index} />
          </motion.div>
        ))}
      </motion.div>

      {loadingMore && <LoadingSpinner />}
    </motion.div>
  );
}

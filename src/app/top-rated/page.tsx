"use client";

import { motion } from "framer-motion";
import { useTopRatedMovies } from "@/hooks/useMovies";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import { generateId } from "@/utils/generateId";

export default function TopRatedPage() {
  const { data, isLoading, error } = useTopRatedMovies();

  if (isLoading) return <Loading />;
  if (error) throw error;

  const movies = data?.results.slice(0, 10) ?? [];

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
        Top 10 Movies
      </motion.h1>

      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
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
        {movies.map((movie, index) => (
          <motion.div
            key={generateId("top-movie", movie.id, index)}
            className="relative"
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <div className="absolute -left-4 -top-4 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center z-10">
              <span className="text-white font-bold">{index + 1}</span>
            </div>
            <MovieCard movie={movie} index={index} />
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}

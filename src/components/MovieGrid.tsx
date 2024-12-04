"use client";

import { motion } from "framer-motion";
import { Movie } from "@/types/movie";
import MovieCard from "@/components/MovieCard";
import { useRouter } from "next/navigation";

interface MovieGridProps {
  movies: Movie[];
  prefix?: string;
  isLoading?: boolean;
}

export default function MovieGrid({
  movies,
  prefix = "movie",
}: MovieGridProps) {
  const router = useRouter();

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const movieCard = target.closest("[data-movie-id]");
    if (movieCard) {
      const movieId = movieCard.getAttribute("data-movie-id");
      router.push(`/movie/${movieId}`);
    }
  };

  return (
    <motion.div
      className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
      variants={{
        hidden: { opacity: 0 },
        show: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      }}
      initial="hidden"
      animate="show"
      onClick={handleContainerClick}
    >
      {movies.map((movie, index) => (
        <motion.div
          key={`${prefix}-${movie.id}-${index}`}
          className="relative"
          data-movie-id={movie.id}
          variants={{
            hidden: { opacity: 0, y: 20 },
            show: { opacity: 1, y: 0 },
          }}
        >
          <MovieCard movie={movie} index={index} />
        </motion.div>
      ))}
    </motion.div>
  );
}

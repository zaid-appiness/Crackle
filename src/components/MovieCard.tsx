"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Movie } from "@/types/movie";
import MovieCardSkeleton from "./MovieCardSkeleton";
import { FaStar, FaCalendar, FaPlayCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import { useRouter } from "next/navigation";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { data: similarMovies } = useQuery({
    queryKey: ["similar", movie.id],
    queryFn: () => movieApi.getSimilarMovies(movie.id),
    enabled: isHovered,
    staleTime: 1000 * 60 * 5,
  });

  const handleMovieClick = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer group"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={() => handleMovieClick(movie.id)}
    >
      {!imageLoaded && <MovieCardSkeleton />}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: imageLoaded ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="absolute inset-0"
      >
        <Image
          src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          onLoad={() => setImageLoaded(true)}
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* Content Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 bg-black/80 p-4 flex flex-col justify-between"
            >
              {/* Movie Info */}
              <div className="space-y-2">
                <h3 className="text-white font-semibold line-clamp-2">
                  {movie.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FaCalendar className="text-gray-400" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                </div>
              </div>

              {/* Similar Movies Preview */}
              {similarMovies && similarMovies.results.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-2"
                >
                  <h4 className="text-sm font-medium text-gray-400">
                    Similar Movies
                  </h4>
                  <div className="similar-movies-container flex gap-2 pb-2">
                    {similarMovies.results.slice(0, 3).map((similar: Movie) => (
                      <div
                        key={similar.id}
                        className="flex-shrink-0 w-16 h-24 relative rounded overflow-hidden 
                        transform transition-transform hover:scale-105"
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering parent's onClick
                          handleMovieClick(similar.id);
                        }}
                      >
                        <Image
                          src={`https://image.tmdb.org/t/p/w200${similar.poster_path}`}
                          alt={similar.title}
                          fill
                          className="object-cover"
                        />
                        <div
                          className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 
                        transition-opacity flex items-center justify-center"
                        >
                          <FaPlayCircle className="text-white text-lg" />
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* View Details Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 text-blue-400 text-sm mt-2"
              >
                <FaPlayCircle />
                <span>View Details</span>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

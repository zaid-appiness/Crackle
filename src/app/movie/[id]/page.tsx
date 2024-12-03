"use client";

import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { movieApi } from "@/lib/api";
import Image from "next/image";
import { FaStar, FaClock, FaCalendar, FaPlay, FaImdb } from "react-icons/fa";
import Loading from "@/components/Loading";
import MovieCard from "@/components/MovieCard";

export default function MovieDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ["movie", params.id],
    queryFn: () => movieApi.getMovieDetails(Number(params.id)),
  });

  const { data: similarMovies } = useQuery({
    queryKey: ["similar", params.id],
    queryFn: () => movieApi.getSimilarMovies(Number(params.id)),
    enabled: !!movie,
  });

  const { data: videoData } = useQuery({
    queryKey: ["video", params.id],
    queryFn: () => movieApi.getMovieVideos(Number(params.id)),
    enabled: !!movie,
  });

  if (isLoadingMovie) return <Loading />;
  if (!movie) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop */}
      <div className="relative h-[70vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto flex gap-8 items-end">
            {/* Poster */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="hidden md:block w-64 aspect-[2/3] relative rounded-lg overflow-hidden shadow-2xl"
            >
              <Image
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                fill
                className="object-cover"
              />
            </motion.div>

            {/* Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex-1 space-y-4"
            >
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {movie.title}
              </h1>

              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-yellow-500">
                  <FaStar />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaClock />
                  <span>{movie.runtime} min</span>
                </div>
                <div className="flex items-center gap-2 text-gray-300">
                  <FaCalendar />
                  <span>{new Date(movie.release_date).getFullYear()}</span>
                </div>
              </div>

              <p className="text-gray-300 max-w-2xl line-clamp-3 md:line-clamp-none">
                {movie.overview}
              </p>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                {videoData && (
                  <a
                    href={`https://www.youtube.com/watch?v=${videoData.key}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg 
                    hover:bg-red-700 transition-colors"
                  >
                    <FaPlay />
                    Watch Trailer
                  </a>
                )}
                <a
                  href={`https://www.imdb.com/title/${movie.imdb_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-500 text-black rounded-lg 
                  hover:bg-yellow-400 transition-colors"
                >
                  <FaImdb className="text-xl" />
                  IMDb
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      {similarMovies && similarMovies.results.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-white mb-6"
          >
            Similar Movies
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6"
          >
            {similarMovies.results.slice(0, 10).map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </motion.div>
        </div>
      )}
    </div>
  );
}

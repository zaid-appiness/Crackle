"use client";

import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { movieApi } from "@/lib/api";
import Image from "next/image";
import {
  FaStar,
  FaClock,
  FaCalendar,
  FaPlay,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import Loading from "@/components/Loading";
import { useParams } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import MovieGrid from "@/components/MovieGrid";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Handle mute/unmute using YouTube API
  useEffect(() => {
    if (isPlaying && iframeRef.current) {
      // Post message to YouTube player
      iframeRef.current.contentWindow?.postMessage(
        JSON.stringify({
          event: "command",
          func: isMuted ? "mute" : "unMute",
        }),
        "*"
      );
    }
  }, [isMuted, isPlaying]);

  const { data: movie, isLoading: isLoadingMovie } = useQuery({
    queryKey: ["movie", movieId],
    queryFn: () => movieApi.getMovieDetails(movieId),
  });

  const { data: similarMovies } = useQuery({
    queryKey: ["similar", movieId],
    queryFn: () => movieApi.getSimilarMovies(movieId),
    enabled: !!movie,
  });

  const { data: videoSource } = useQuery({
    queryKey: ["movie-stream", movieId],
    queryFn: () => movieApi.getMovieStream(movieId),
  });

  if (isLoadingMovie) return <Loading />;
  if (!movie) return null;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Backdrop/Video */}
      <div className="relative h-[70vh] w-full">
        <AnimatePresence mode="wait">
          {!isPlaying ? (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            >
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </motion.div>
          ) : (
            <motion.div
              key="player"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black"
            >
              <div className="absolute inset-0 z-10" />

              <iframe
                ref={iframeRef}
                src={`https://www.youtube.com/embed/${
                  videoSource?.key
                }?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1&fs=0&playsinline=1&enablejsapi=1&origin=${
                  typeof window !== "undefined" ? window.location.origin : ""
                }`}
                className="w-full h-full"
                allow="autoplay"
                style={{ border: "none", pointerEvents: "none" }}
                frameBorder="0"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Movie Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-8 z-20">
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
              <div className="flex items-center gap-4 pt-4 relative z-30">
                {videoSource && (
                  <motion.button
                    onClick={() => setIsPlaying(!isPlaying)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg 
                    hover:bg-red-500 transition-colors group"
                  >
                    <FaPlay className="group-hover:animate-pulse" />
                    {isPlaying ? "Watch Poster" : "Watch Trailer"}
                  </motion.button>
                )}
                {isPlaying && (
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="flex items-center justify-center w-12 h-12 rounded-full 
                      bg-white/5 backdrop-blur-sm border border-white/10 transition-all 
                      hover:border-white/20 group z-30"
                    >
                      {isMuted ? (
                        <FaVolumeMute className="text-white/70 text-xl group-hover:text-white transition-colors" />
                      ) : (
                        <FaVolumeUp className="text-white/70 text-xl group-hover:text-white transition-colors" />
                      )}
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      {similarMovies && similarMovies.results.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-white mb-6">Similar Movies</h2>
          <MovieGrid
            movies={similarMovies.results.slice(0, 10)}
            prefix="similar"
          />
        </div>
      )}
    </div>
  );
}

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
  FaPause,
} from "react-icons/fa";
import Loading from "@/components/Loading";
import MovieCard from "@/components/MovieCard";
import { useParams } from "next/navigation";
import { useState, useRef } from "react";
import ReactPlayer from "react-player";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = Number(params.id);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(true);

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
              <ReactPlayer
                ref={playerRef}
                url={
                  videoSource?.type === "youtube"
                    ? `https://www.youtube.com/watch?v=${videoSource.key}`
                    : videoSource?.url
                }
                width="100%"
                height="100%"
                playing={isVideoPlaying}
                muted={isMuted}
                controls={false}
                style={{ position: "absolute", top: 0, left: 0 }}
                config={{
                  youtube: {
                    playerVars: {
                      showinfo: 0,
                      modestbranding: 1,
                      rel: 0,
                      controls: 0,
                      disablekb: 1,
                      iv_load_policy: 3,
                      fs: 0,
                      playsinline: 1,
                      enablejsapi: 1,
                      origin: window.location.origin,
                    },
                  },
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>

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
              <div className="flex items-center gap-4 pt-4">
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
                      onClick={() => setIsVideoPlaying(!isVideoPlaying)}
                      className="flex items-center justify-center w-12 h-12 rounded-full 
                      bg-white/5 backdrop-blur-sm border border-white/10 transition-all 
                      hover:border-white/20 group"
                    >
                      {isVideoPlaying ? (
                        <FaPause className="text-white/70 text-xl group-hover:text-white transition-colors" />
                      ) : (
                        <FaPlay className="text-white/70 text-xl group-hover:text-white transition-colors" />
                      )}
                    </motion.button>
                    <motion.button
                      whileHover={{
                        scale: 1.05,
                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                      }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setIsMuted(!isMuted)}
                      className="flex items-center justify-center w-12 h-12 rounded-full 
                      bg-white/5 backdrop-blur-sm border border-white/10 transition-all 
                      hover:border-white/20 group"
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

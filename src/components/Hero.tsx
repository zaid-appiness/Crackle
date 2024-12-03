"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Movie } from "@/types/movie";
import { FaPlay, FaStar, FaInfoCircle } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  const router = useRouter();

  const { data: videoData } = useQuery({
    queryKey: ["video", movie.id],
    queryFn: () => movieApi.getMovieVideos(movie.id),
  });

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      {/* Background Image with Parallax Effect */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 10, repeat: Infinity, repeatType: "reverse" }}
        className="absolute inset-0"
      >
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          priority
          className="object-cover"
        />
        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
      </motion.div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl space-y-6"
        >
          {/* Title with Animated Gradient */}
          <h1 className="text-5xl md:text-6xl font-bold">
            <span
              className="bg-gradient-to-r from-white via-white to-transparent 
            bg-clip-text text-transparent animate-gradient"
            >
              {movie.title}
            </span>
          </h1>

          {/* Rating Badge */}
          <div className="flex items-center gap-4">
            <div
              className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 
            rounded-full text-yellow-500 font-semibold"
            >
              <FaStar />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.8 }}
              className="px-3 py-1 bg-blue-500/20 rounded-full text-blue-400 text-sm"
            >
              Trending Now
            </motion.div>
          </div>

          {/* Overview with Gradient Fade */}
          <p
            className="text-lg text-gray-300 line-clamp-3 
          bg-gradient-to-r from-white via-gray-300 to-gray-500 bg-clip-text text-transparent"
          >
            {movie.overview}
          </p>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {videoData && (
              <motion.a
                href={`https://www.youtube.com/watch?v=${videoData.key}`}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg 
                hover:bg-red-500 transition-colors group"
              >
                <FaPlay className="group-hover:animate-pulse" />
                Watch Trailer
              </motion.a>
            )}
            <motion.button
              onClick={() => router.push(`/movie/${movie.id}`)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 px-6 py-3 bg-gray-800/80 text-white rounded-lg 
              hover:bg-gray-700/80 transition-colors backdrop-blur-sm border border-gray-700/50"
            >
              <FaInfoCircle />
              More Info
            </motion.button>
          </div>
        </motion.div>

        {/* Floating Poster */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="hidden lg:block absolute right-12 bottom-[-10%] w-64 aspect-[2/3]"
        >
          <div
            className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl 
          transform -rotate-6 hover:rotate-0 transition-transform duration-300"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

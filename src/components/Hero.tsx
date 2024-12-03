"use client";

import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { Movie } from "@/types/movie";
import {
  FaPlay,
  FaStar,
  FaInfoCircle,
  FaVolumeUp,
  FaVolumeMute,
} from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player";
import { useScroll, useTransform, useAnimation } from "framer-motion";

interface HeroProps {
  movie: Movie;
}

export default function Hero({ movie }: HeroProps) {
  const router = useRouter();
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const playerRef = useRef<ReactPlayer>(null);
  const { scrollY } = useScroll();
  const controls = useAnimation();

  const { data: videoSource } = useQuery({
    queryKey: ["movie-stream", movie.id],
    queryFn: () => movieApi.getMovieStream(movie.id),
  });

  // Adjust parallax effects
  const opacity = useTransform(scrollY, [0, 500], [1, 0.3]);
  const titleY = useTransform(scrollY, [0, 300], [0, 30]);

  // Add floating animation
  useEffect(() => {
    controls.start({
      y: [0, -20, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    });
  }, [controls]);

  return (
    <div className="relative h-[85vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {!isPlaying ? (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{
              opacity: 1,
              y: [-20, 0, -20],
              scale: [1, 1.05, 1],
            }}
            transition={{
              y: {
                duration: 20,
                repeat: Infinity,
                ease: "easeInOut",
              },
              scale: {
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
            exit={{ opacity: 0 }}
            className="absolute inset-0"
            style={{ opacity }}
          >
            <Image
              src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
              alt={movie.title}
              fill
              priority
              className="object-cover"
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-black via-black/50 to-transparent"
              style={{ opacity }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"
              style={{ opacity }}
            />
          </motion.div>
        ) : (
          // Video Player
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
              playing={true}
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
                  },
                },
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content */}
      <motion.div
        className="relative h-full container mx-auto px-4 flex items-center"
        animate={controls}
      >
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-2xl space-y-6"
          style={{ y: titleY }}
        >
          {/* Title with Animated Gradient */}
          <motion.h1
            className="text-5xl md:text-6xl font-bold"
            style={{ y: titleY }}
          >
            <span
              className="bg-gradient-to-r from-white via-white to-transparent 
              bg-clip-text text-transparent animate-gradient"
            >
              {movie.title}
            </span>
          </motion.h1>

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
            {videoSource && (
              <motion.button
                onClick={() => setIsPlaying(!isPlaying)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg 
                hover:bg-red-500 transition-colors group"
              >
                {isPlaying ? (
                  <>
                    <FaPlay className="group-hover:animate-pulse" />
                    Watch Poster
                  </>
                ) : (
                  <>
                    <FaPlay className="group-hover:animate-pulse" />
                    Watch Trailer
                  </>
                )}
              </motion.button>
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
            {isPlaying && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
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
            )}
          </div>
        </motion.div>

        {/* Floating Poster with enhanced parallax */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{
            opacity: 1,
            y: [-10, 10, -10],
            rotate: [-3, 3, -3],
          }}
          transition={{
            y: {
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            },
            rotate: {
              duration: 12,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          className="hidden lg:block absolute right-12 bottom-[-10%] w-64 aspect-[2/3]"
        >
          <div
            className="relative w-full h-full rounded-lg overflow-hidden shadow-2xl 
            hover:rotate-0 transition-transform duration-300"
          >
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              fill
              className="object-cover"
            />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

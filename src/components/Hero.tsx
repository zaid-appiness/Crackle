"use client";

import { useEffect, useState, useCallback, memo, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Movie } from "@/types/movie";
import { FaPlay, FaVolumeMute, FaVolumeUp } from "react-icons/fa";
import Image from "next/image";
import { movieApi } from "@/lib/api";

interface HeroProps {
  movie: Movie;
}

const Hero = memo(({ movie }: HeroProps) => {
  const [videoKey, setVideoKey] = useState<string | null>(null);
  const [muted, setMuted] = useState(true);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  const toggleMute = useCallback(() => {
    if (iframeRef.current) {
      const message = muted ? "unMute" : "mute";
      iframeRef.current.contentWindow?.postMessage(
        `{"event":"command","func":"${message}","args":""}`,
        "*"
      );
    }
    setMuted((prev) => !prev);
  }, [muted]);

  const videoUrl = useMemo(() => {
    if (!videoKey) return "";
    return `https://www.youtube.com/embed/${videoKey}?autoplay=1&mute=1&enablejsapi=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1&playlist=${videoKey}&loop=1`;
  }, [videoKey]);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const video = await movieApi.getMovieVideos(movie.id);
        if (video) {
          setVideoKey(video.key);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, [movie.id]);

  const toggleVideo = useCallback(() => {
    setIsVideoPlaying((prev) => !prev);
  }, []);

  return (
    <div className="relative h-[80vh] w-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={isVideoPlaying ? "video" : "image"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="absolute inset-0"
        >
          {videoKey && isVideoPlaying ? (
            <div className="relative w-full h-full">
              <iframe
                ref={iframeRef}
                src={videoUrl}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                className="absolute w-[100vw] h-[100vh] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-150"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
            </div>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent z-10" />
              <Image
                src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                alt={movie.title}
                fill
                priority
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="absolute bottom-0 left-0 p-8 z-20 space-y-4"
      >
        <h1 className="text-6xl font-bold text-white mb-4">{movie.title}</h1>
        <p className="text-gray-200 max-w-2xl text-lg">{movie.overview}</p>
        <div className="flex items-center gap-4">
          {videoKey && (
            <>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleVideo}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black 
                rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                <FaPlay />
                {isVideoPlaying ? "Show Poster" : "Play Trailer"}
              </motion.button>
              {isVideoPlaying && (
                <motion.button
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleMute}
                  className="p-3 bg-gray-800/50 rounded-full hover:bg-gray-700/50 
                  transition-colors text-white"
                >
                  {muted ? (
                    <FaVolumeMute size={20} />
                  ) : (
                    <FaVolumeUp size={20} />
                  )}
                </motion.button>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
});

Hero.displayName = "Hero";

export default Hero;

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Movie } from "@/types/movie";
import MovieCardSkeleton from "./MovieCardSkeleton";

interface MovieCardProps {
  movie: Movie;
  index: number;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const router = useRouter();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className="relative aspect-[2/3] rounded-lg overflow-hidden cursor-pointer"
      onClick={() => router.push(`/movie/${movie.id}`)}
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
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="text-white font-semibold line-clamp-2">
            {movie.title}
          </h3>
          <p className="text-gray-300 text-sm">
            {new Date(movie.release_date).getFullYear()}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

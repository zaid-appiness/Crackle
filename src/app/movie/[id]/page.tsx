"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { movieApi } from "@/lib/api";
import { Movie, MovieDetails } from "@/types/movie";
import Image from "next/image";
import Loading from "@/components/Loading";

export default function MoviePage({ params }: { params: { id: string } }) {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        const movieData = await movieApi.getMovieDetails(Number(params.id));
        const similarData = await movieApi.getSimilarMovies(Number(params.id));
        setMovie(movieData);
        setSimilarMovies(similarData.results.slice(0, 6));
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params.id]);

  if (loading) return <Loading />;
  if (!movie) return <div>Movie not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="relative h-[60vh] w-full">
        <Image
          src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
      </div>

      <div className="container mx-auto px-4">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="space-y-4"
        >
          <h1 className="text-4xl font-bold text-white">{movie.title}</h1>
          <div className="flex gap-4 text-gray-400">
            <span>{new Date(movie.release_date).getFullYear()}</span>
            <span>{movie.runtime} min</span>
            <span>{movie.vote_average.toFixed(1)} ⭐</span>
          </div>
          <p className="text-gray-300 max-w-2xl">{movie.overview}</p>

          {similarMovies.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-white mb-4">
                Similar Movies
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {similarMovies.map((movie) => (
                  <motion.div
                    key={movie.id}
                    whileHover={{ scale: 1.05 }}
                    className="relative aspect-[2/3]"
                  >
                    <Image
                      src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                      alt={movie.title}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}

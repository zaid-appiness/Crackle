"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { movieApi } from "@/lib/api";
import { Movie, MovieDetails } from "@/types/movie";
import Image from "next/image";
import Loading from "@/components/Loading";

export default function MoviePage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [similarMovies, setSimilarMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (params?.id) {
          const movieData = await movieApi.getMovieDetails(Number(params.id));
          const similarData = await movieApi.getSimilarMovies(
            Number(params.id)
          );
          setMovie(movieData);
          setSimilarMovies(similarData.results.slice(0, 6));
        }
      } catch (error) {
        console.error("Error fetching movie:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [params?.id]);

  if (loading) return <Loading />;
  if (!movie) return <div>Movie not found</div>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="relative h-[60vh] w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          className="relative h-full w-full"
        >
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            onLoad={() => setImageLoaded(true)}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute bottom-0 left-0 p-8 z-10 w-full"
        >
          <div className="container mx-auto">
            <h1 className="text-4xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            <div className="flex gap-4 text-gray-300 mb-4">
              <span>{new Date(movie.release_date).getFullYear()}</span>
              <span>{movie.runtime} min</span>
              <span>{movie.vote_average.toFixed(1)} ⭐</span>
            </div>
            <p className="text-gray-200 max-w-2xl text-lg">{movie.overview}</p>
          </div>
        </motion.div>
      </div>

      {similarMovies.length > 0 && (
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-2xl font-bold text-white">Similar Movies</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {similarMovies.map((movie) => (
                <motion.div
                  key={movie.id}
                  whileHover={{ scale: 1.05 }}
                  className="relative aspect-[2/3] cursor-pointer"
                  onClick={() => router.push(`/movie/${movie.id}`)}
                >
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover rounded-lg"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}

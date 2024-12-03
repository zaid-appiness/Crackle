"use client";

import { useQuery } from "@tanstack/react-query";
import MovieCard from "./MovieCard";
import { movieApi } from "@/lib/api";

export default function MovieRecommendations({ movieId }: { movieId: number }) {
  const { data } = useQuery({
    queryKey: ["recommendations", movieId],
    queryFn: () => movieApi.getMovieRecommendations(movieId),
  });

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Recommended Movies</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {data?.results.slice(0, 10).map((movie, index) => (
          <MovieCard key={movie.id} movie={movie} index={index} />
        ))}
      </div>
    </div>
  );
}

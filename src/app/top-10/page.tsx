import { Suspense } from "react";
import { movieApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import { Movie } from "@/types/movie";

async function getTopMovies() {
  const data = await movieApi.getTopRatedMovies();
  return data.results.slice(0, 10);
}

export default async function TopMoviesPage() {
  const movies = await getTopMovies();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Top 10 Movies</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <Suspense fallback={<Loading />}>
          {movies.map((movie: Movie, index: number) => (
            <div key={movie.id} className="relative">
              <div className="absolute -left-2 -top-2 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white">
                {index + 1}
              </div>
              <MovieCard movie={movie} index={index} />
            </div>
          ))}
        </Suspense>
      </div>
    </div>
  );
}

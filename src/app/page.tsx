import { Suspense } from "react";
import { movieApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import { Movie } from "@/types/movie";

async function getMovies() {
  const data = await movieApi.getPopularMovies();
  return data.results;
}

export default async function Home() {
  const movies = await getMovies();

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold">Popular Movies</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        <Suspense fallback={<Loading />}>
          {movies.map((movie: Movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </Suspense>
      </div>
    </div>
  );
}

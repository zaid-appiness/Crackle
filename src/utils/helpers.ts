import { Movie } from "@/types/movie";
import { FilterState } from "@/components/MovieFilters";

export function filterMovies(movies: Movie[], filters: FilterState) {
  return movies.filter((movie) => {
    const passesRating = movie.vote_average >= filters.rating;
    const passesGenre =
      !filters.genre || movie.genre_ids.includes(filters.genre);
    return passesRating && passesGenre;
  });
}

export const generateMovieCardId = (
  movieId: number,
  index: number,
  prefix = "movie"
): string => {
  const timestamp = Date.now();
  return `${prefix}-${movieId}-${index}-${timestamp}`;
};

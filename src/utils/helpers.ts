import { Movie } from "@/types/movie";
import { FilterState } from "@/types/filters";

export function filterMovies(movies: Movie[], filters?: FilterState) {
  if (!filters) return movies;

  return movies.filter((movie) => {
    const passesRating =
      !filters.rating || movie.vote_average >= filters.rating;
    const passesGenre =
      !filters.genres?.length ||
      movie.genre_ids.some((id) => filters.genres.includes(id));
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

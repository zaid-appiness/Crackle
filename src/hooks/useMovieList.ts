import { useState } from "react";
import { FilterState } from "@/components/MovieFilters";
import { Movie } from "@/types/movie";

export function useMovieList() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  const filterMovies = (movies: Movie[]) => {
    return movies.filter((movie) => {
      const passesRating = movie.vote_average >= filters.rating;
      const passesGenre = !filters.genre || movie.genre_ids.includes(filters.genre);
      return passesRating && passesGenre;
    });
  };

  const handlePageChange = (newPage: number, totalPages: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
  };

  return {
    page,
    filters,
    setFilters,
    filterMovies,
    handlePageChange,
  };
} 
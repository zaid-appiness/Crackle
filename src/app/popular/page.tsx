"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import { useState } from "react";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import { Movie } from "@/types/movie";

export default function PopularPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => movieApi.getPopularMovies(page),
  });

  const filteredMovies = data?.results.filter((movie: Movie) => {
    const passesRating = movie.vote_average >= filters.rating;
    const passesGenre =
      !filters.genre || movie.genre_ids.includes(filters.genre);
    return passesRating && passesGenre;
  });

  if (isLoading) return <Loading />;
  if (error) throw error;

  const totalPages = Math.min(data?.total_pages ?? 0, 500);
  const currentPage = data?.page ?? 1;

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    window.scrollTo({ top: 0, behavior: "smooth" });
    setPage(newPage);
  };

  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === currentPage ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8"
    >
      <div className="flex justify-between items-center">
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-white"
        >
          Popular Movies
        </motion.h1>
        <MovieFilters
          onFilterChange={setFilters}
          onReset={() => setFilters({ rating: 0, genre: null })}
        />
      </div>

      {!filteredMovies?.length ? (
        <NoResults />
      ) : (
        <MovieGrid movies={filteredMovies} prefix="popular" />
      )}

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 py-8">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 
          disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
        >
          Previous
        </button>

        <div className="flex items-center gap-2">
          {getVisiblePages().map((pageNum, index) => (
            <div key={index}>
              {pageNum === "..." ? (
                <span className="text-gray-400 px-2">{pageNum}</span>
              ) : (
                <button
                  onClick={() => handlePageChange(Number(pageNum))}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    pageNum === currentPage
                      ? "bg-blue-600 text-white"
                      : "bg-gray-800 text-white hover:bg-gray-700"
                  }`}
                >
                  {pageNum}
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-800 text-white rounded-lg disabled:opacity-50 
          disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
        >
          Next
        </button>
      </div>
    </motion.div>
  );
}

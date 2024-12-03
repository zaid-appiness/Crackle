"use client";

import { Suspense, useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import MovieCard from "@/components/MovieCard";
import Loading from "@/components/Loading";
import Hero from "@/components/Hero";
import { generateId } from "@/utils/generateId";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import { useRouter } from "next/navigation";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";

export default function Home() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<FilterState>({
    rating: 0,
    genre: null,
  });

  const { data: trendingData } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => movieApi.getTrendingMovies(),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => movieApi.getPopularMovies(page),
  });

  const router = useRouter();

  if (isLoading || !trendingData) return <MovieGridSkeleton />;
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

  const filteredMovies = data?.results.filter((movie) => {
    const passesRating = movie.vote_average >= filters.rating;
    const passesGenre =
      !filters.genre || movie.genre_ids.includes(filters.genre);
    return passesRating && passesGenre;
  });

  const handleContainerClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;

    // Handle movie card clicks
    const movieCard = target.closest("[data-movie-id]");
    if (movieCard) {
      const movieId = movieCard.getAttribute("data-movie-id");
      router.push(`/movie/${movieId}`);
      return;
    }

    // Handle pagination clicks
    const pageButton = target.closest("[data-page]");
    if (pageButton) {
      const page = pageButton.getAttribute("data-page");
      if (page !== "...") {
        handlePageChange(Number(page));
      }
      return;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
      onClick={handleContainerClick}
    >
      <Hero movie={trendingData.results[0]} />

      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-white"
          >
            Popular Movies
          </motion.h2>
          <MovieFilters
            onFilterChange={setFilters}
            onReset={() => setFilters({ rating: 0, genre: null })}
          />
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
          initial="hidden"
          animate="show"
        >
          <Suspense fallback={<Loading />}>
            {filteredMovies?.map((movie, index) => (
              <motion.div
                key={generateId("home-movie", movie.id, index)}
                className="relative"
                data-movie-id={movie.id}
              >
                <MovieCard movie={movie} index={index} />
              </motion.div>
            ))}
          </Suspense>
        </motion.div>

        {/* Pagination with data attributes */}
        <div className="flex flex-wrap justify-center items-center gap-2 py-8">
          <button
            data-page={currentPage - 1}
            disabled={currentPage === 1}
            className="px-3 md:px-4 py-2 bg-gray-800 text-white text-sm rounded-lg disabled:opacity-50 
            disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Previous
          </button>

          <div className="flex flex-wrap items-center gap-2">
            {getVisiblePages().map((pageNum, index) => (
              <div key={index}>
                {pageNum === "..." ? (
                  <span className="text-gray-400 px-2" data-page="...">
                    {pageNum}
                  </span>
                ) : (
                  <button
                    data-page={pageNum}
                    className={`px-3 md:px-4 py-2 text-sm rounded-lg transition-colors ${
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
            data-page={currentPage + 1}
            disabled={currentPage === totalPages}
            className="px-3 md:px-4 py-2 bg-gray-800 text-white text-sm rounded-lg disabled:opacity-50 
            disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </motion.div>
  );
}

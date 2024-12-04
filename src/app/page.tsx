"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Hero from "@/components/Hero";
import MovieFilters, { FilterState } from "@/components/MovieFilters";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";
import NoResults from "@/components/NoResults";
import HeroSkeleton from "@/components/HeroSkeleton";
import { Movie } from "@/types/movie";
import AnimatedCounter from "@/components/AnimatedCounter";
import MovieGrid from "@/components/MovieGrid";

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

  const filteredMovies = data?.results.filter((movie: Movie) => {
    const passesRating = movie.vote_average >= filters.rating;
    const passesGenre =
      !filters.genre || movie.genre_ids.includes(filters.genre);
    return passesRating && passesGenre;
  });

  if (isLoading || !trendingData)
    return (
      <div className="min-h-screen">
        <HeroSkeleton />
        <div className="container mx-auto px-4 py-8">
          <MovieGridSkeleton />
        </div>
      </div>
    );
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
      className="space-y-16"
    >
      {/* Hero Section */}
      <Hero movie={trendingData.results[0]} />

      {/* Main Content */}
      <div className="container mx-auto px-4 space-y-16">
        {/* Stats Section */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Movies", value: "10,000+" },
            { label: "Genres", value: "20+" },
            { label: "Languages", value: "50+" },
            { label: "New Weekly", value: "100+" },
          ].map(({ label, value }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 text-center border border-gray-700/50"
            >
              <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                <AnimatedCounter value={value} />
              </h3>
              <p className="text-gray-400 mt-2">{label}</p>
            </motion.div>
          ))}
        </section>

        {/* Popular Movies Section */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <div className="space-y-2">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-3xl font-bold text-white"
              >
                Popular Movies
              </motion.h2>
              <p className="text-gray-400">Most watched movies this week</p>
            </div>
            <MovieFilters
              onFilterChange={setFilters}
              onReset={() => setFilters({ rating: 0, genre: null })}
            />
          </div>

          {!filteredMovies?.length ? (
            <NoResults />
          ) : (
            <>
              <MovieGrid movies={filteredMovies} prefix="home" />

              {/* Pagination */}
              <div className="flex justify-center items-center gap-2 py-8">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
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
                          onClick={() => handlePageChange(Number(pageNum))}
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
                  onClick={() => handlePageChange(currentPage + 1)}
                  data-page={currentPage + 1}
                  disabled={currentPage === totalPages}
                  className="px-3 md:px-4 py-2 bg-gray-800 text-white text-sm rounded-lg disabled:opacity-50 
                  disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </section>

        {/* Features Section */}
        <section className="py-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-white text-center mb-12"
          >
            Why Choose Us
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "HD Quality",
                description: "Watch all movies in high definition quality",
                icon: "🎥",
              },
              {
                title: "Regular Updates",
                description: "New movies added every week",
                icon: "🔄",
              },
              {
                title: "Watch Anywhere",
                description: "Available on all your devices",
                icon: "📱",
              },
            ].map(({ title, description, icon }) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-gray-800/30 backdrop-blur-sm rounded-xl p-6 border border-gray-700/30
                hover:bg-gray-800/50 transition-colors duration-300"
              >
                <div className="text-4xl mb-4">{icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {title}
                </h3>
                <p className="text-gray-400">{description}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </motion.div>
  );
}

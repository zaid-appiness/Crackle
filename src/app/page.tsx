"use client";

import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import Hero from "@/components/Hero";
import MovieGridSkeleton from "@/components/MovieGridSkeleton";
import NoResults from "@/components/NoResults";
import HeroSkeleton from "@/components/HeroSkeleton";
import MovieGrid from "@/components/MovieGrid";
import AnimatedCounter from "@/components/AnimatedCounter";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { useMovieList } from "@/hooks/useMovieList";
import { features, stats } from "@/utils/constants";

export default function Home() {
  const { page, setFilters, filterMovies, handlePageChange } = useMovieList();

  const { data: trendingData } = useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => movieApi.getTrendingMovies(),
  });

  const { data, isLoading, error } = useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => movieApi.getPopularMovies(page),
  });

  const filteredMovies = data?.results ? filterMovies(data.results) : [];
  const totalPages = Math.min(data?.total_pages ?? 0, 500);

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
          {stats.map(({ label, value }) => (
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
        <section className="space-y-8">
          <PageHeader
            title="Popular Movies"
            subtitle="Most watched movies this week"
            onFilterChange={setFilters}
            onFilterReset={() => setFilters({ rating: 0, genre: null })}
          />

          {!filteredMovies?.length ? (
            <NoResults />
          ) : (
            <>
              <MovieGrid movies={filteredMovies} prefix="home" />
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(newPage) =>
                  handlePageChange(newPage, totalPages)
                }
              />
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
            {features.map(({ title, description, icon }) => (
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

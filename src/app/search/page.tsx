"use client";

import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { movieApi } from "@/lib/api";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import SearchPageSkeleton from "@/components/SearchPageSkeleton";
import { motion } from "framer-motion";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const { data, isLoading } = useQuery({
    queryKey: ["search", query],
    queryFn: () => movieApi.searchMovies(query),
    enabled: !!query,
  });

  if (isLoading) {
    return <SearchPageSkeleton />;
  }

  if (!query) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoResults
          message="Start your search"
          subMessage="Use the search bar above to find movies"
        />
      </div>
    );
  }

  if (!data?.results.length) {
    return (
      <div className="container mx-auto px-4 py-8">
        <NoResults
          message="No results found"
          subMessage="Try searching for something else"
        />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-2"
      >
        <h1 className="text-2xl font-bold text-white">
          Search Results for &quot;{query}&quot;
        </h1>
        <p className="text-gray-400">
          Found {data.total_results.toLocaleString()} results
        </p>
      </motion.div>

      <MovieGrid movies={data.results} prefix="search" />
    </div>
  );
}

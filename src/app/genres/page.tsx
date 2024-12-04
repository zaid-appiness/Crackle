"use client";

import { Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { useMovieList } from "@/hooks/useMovieList";
import { genreData } from "@/utils/constants";
import { Genre } from "@/types/genre";

function GenreCard({
  genre,
  isSelected,
  onClick,
}: {
  genre: Genre;
  isSelected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={`relative p-6 rounded-xl bg-gradient-to-br ${genre.color} 
      group overflow-hidden transition-all duration-300
      ${
        isSelected ? "scale-[0.98] ring-2 ring-white/50" : "hover:scale-[1.02]"
      }`}
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity" />
      <div className="relative space-y-2">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{genre.icon}</span>
          <h3 className="text-xl font-bold text-white">{genre.name}</h3>
        </div>
        <p className="text-white/80 text-sm">{genre.description}</p>
      </div>
    </motion.button>
  );
}

function GenreSelector({
  selectedGenre,
  onGenreSelect,
}: {
  selectedGenre: number | null;
  onGenreSelect: (id: number) => void;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
      {genreData.map(({ category, genres }) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <h3 className="text-xl font-semibold text-white/80">{category}</h3>
          <div className="space-y-3">
            {genres.map((genre) => (
              <GenreCard
                key={genre.id}
                genre={genre}
                isSelected={selectedGenre === genre.id}
                onClick={() => onGenreSelect(genre.id)}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function GenresPageContent() {
  const searchParams = useSearchParams();
  const selectedGenre = Number(searchParams.get("selected")) || null;
  const { page, setFilters, filterMovies, handlePageChange } = useMovieList();

  const { data, isLoading } = useQuery({
    queryKey: ["movies", "genre", selectedGenre, page],
    queryFn: () =>
      selectedGenre
        ? movieApi.getMoviesByGenre(selectedGenre, page)
        : Promise.reject("No genre selected"),
    enabled: !!selectedGenre,
  });

  const currentGenre = genreData
    .flatMap((category) => category.genres)
    .find((genre) => genre.id === selectedGenre);

  const filteredMovies = data?.results ? filterMovies(data.results) : [];
  const totalPages = Math.min(data?.total_pages ?? 0, 500);

  return (
    <div className="min-h-screen py-12 space-y-16">
      <div className="container mx-auto px-4">
        <PageHeader
          title={currentGenre?.name || "Explore Genres"}
          subtitle={
            currentGenre?.description ||
            "Discover movies across different genres"
          }
          onFilterChange={setFilters}
          onFilterReset={() => setFilters({ rating: 0, genre: null })}
          showFilters={!!selectedGenre}
        />

        <AnimatePresence mode="wait">
          {!selectedGenre ? (
            <motion.div
              key="genre-selector"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <GenreSelector
                selectedGenre={selectedGenre}
                onGenreSelect={(id) => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("selected", id.toString());
                  window.history.pushState({}, "", url);
                  window.location.reload();
                }}
              />
            </motion.div>
          ) : (
            <motion.div
              key="movie-grid"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-8"
            >
              {isLoading ? (
                <Loading />
              ) : !filteredMovies?.length ? (
                <NoResults />
              ) : (
                <>
                  <MovieGrid
                    movies={filteredMovies}
                    prefix={`genre-${selectedGenre}`}
                  />
                  <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(newPage) =>
                      handlePageChange(newPage, totalPages)
                    }
                  />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function GenresPage() {
  return (
    <Suspense fallback={<Loading />}>
      <GenresPageContent />
    </Suspense>
  );
}

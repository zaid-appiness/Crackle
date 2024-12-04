"use client";

import { Suspense, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import PageHeader from "@/components/PageHeader";
import Pagination from "@/components/Pagination";
import { useMovieList } from "@/hooks/useMovieList";
import { genreData } from "@/utils/constants";
import { Genre } from "@/types/genre";
import { FaArrowLeft, FaChevronDown } from "react-icons/fa";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";

function GenreCard({ genre }: { genre: Genre }) {
  const router = useRouter();
  return (
    <motion.div
      onClick={() => router.push(`/genres?selected=${genre.id}`)}
      className={`group cursor-pointer relative overflow-hidden rounded-lg 
      bg-gradient-to-br ${genre.color} aspect-[2/1] hover:shadow-xl
      hover:shadow-${genre.color.split("from-")[1].split(" ")[0]}/20`}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_50%_50%,_transparent_1px,_currentColor_1px)] 
        bg-[length:6px_6px] scale-150 group-hover:scale-100 transition-transform duration-500"
      />

      {/* Content */}
      <div className="relative h-full p-3 flex items-center gap-3">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-lg bg-white/10 
          backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform"
        >
          <span className="text-xl">{genre.icon}</span>
        </div>

        <div className="space-y-0.5 flex-grow min-w-0">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white truncate">
              {genre.name}
            </h3>
            <motion.span
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              →
            </motion.span>
          </div>
          <p className="text-xs text-white/70 line-clamp-1">
            {genre.description}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function GenreSection({
  category,
  genres,
  isOpen,
  onToggle,
}: {
  category: string;
  genres: Genre[];
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="overflow-hidden border border-gray-800 rounded-xl"
    >
      <motion.button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 bg-gray-900/50 
        hover:bg-gray-800/50 transition-colors"
      >
        <h2 className="text-xl font-bold text-white/90">{category}</h2>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <FaChevronDown className="text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div
              className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 
            bg-gradient-to-b from-gray-900/50 to-transparent"
            >
              {genres.map((genre) => (
                <GenreCard key={genre.id} genre={genre} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function GenresPageContent() {
  const [openSection, setOpenSection] = useState<string | null>(
    "Action & Adventure"
  );
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenre = Number(searchParams.get("selected")) || null;
  const { page, handlePageChange } = useMovieList();
  const { filters, setFilters, resetFilters } = usePersistedFilters(
    `genre_${selectedGenre}`
  );

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

  const filteredMovies = data?.results
    ? filterMovies(data.results, filters)
    : [];
  const totalPages = Math.min(data?.total_pages ?? 0, 500);

  return (
    <div className="min-h-screen py-12 space-y-16">
      <div className="container mx-auto px-4">
        {selectedGenre ? (
          <>
            <div className="flex items-center gap-4 mb-8">
              <motion.button
                onClick={() => router.push("/genres")}
                className="flex items-center gap-2 px-4 py-2 text-gray-300 hover:text-white 
                bg-gray-800/50 rounded-lg transition-colors"
                whileHover={{ x: -5 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaArrowLeft />
                Back to Genres
              </motion.button>
              <div className="h-8 w-px bg-gray-700" />
              <h1 className="text-3xl font-bold text-white">
                {currentGenre?.name}
              </h1>
            </div>

            {isLoading ? (
              <Loading />
            ) : !filteredMovies?.length ? (
              <NoResults />
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
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
              </motion.div>
            )}
          </>
        ) : (
          <div className="space-y-8">
            <PageHeader
              title="Explore Genres"
              subtitle="Discover movies across different genres"
              onFilterChange={setFilters}
              onFilterReset={resetFilters}
              showFilters={!!selectedGenre}
            />

            <div className="space-y-4">
              {genreData.map(({ category, genres }) => (
                <GenreSection
                  key={category}
                  category={category}
                  genres={genres}
                  isOpen={openSection === category}
                  onToggle={() =>
                    setOpenSection(openSection === category ? null : category)
                  }
                />
              ))}
            </div>
          </div>
        )}
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

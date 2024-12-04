"use client";

import { Suspense } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, useRouter } from "next/navigation";
import { movieApi } from "@/lib/api";
import Loading from "@/components/Loading";
import MovieGrid from "@/components/MovieGrid";
import NoResults from "@/components/NoResults";
import { useMovieList } from "@/hooks/useMovieList";
import { genreData } from "@/utils/constants";
import { FaArrowLeft, FaFilm, FaFire, FaStar } from "react-icons/fa";
import { usePersistedFilters } from "@/hooks/usePersistedFilters";
import { filterMovies } from "@/utils/helpers";

// Types
interface Genre {
  id: number;
  name: string;
  icon: string;
  description: string;
  color: string;
}

interface GenreStats {
  total: number;
  trending: number;
  topRated: number;
}

// Components
const StatCard = ({
  icon,
  label,
  value,
  delay = 0,
}: {
  icon: JSX.Element;
  label: string;
  value: number;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl border border-gray-800/50"
  >
    <div className="flex items-center gap-3">
      <div className="p-3 bg-gray-800/50 rounded-lg">{icon}</div>
      <div>
        <div className="text-sm text-gray-400">{label}</div>
        <div className="text-xl font-bold text-white">
          {value.toLocaleString()}
        </div>
      </div>
    </div>
  </motion.div>
);

const GenreStats = ({ count }: { count: number }) => {
  const stats: { icon: JSX.Element; label: string; value: number }[] = [
    {
      icon: <FaFilm className="text-blue-500" />,
      label: "Movies",
      value: count,
    },
    {
      icon: <FaFire className="text-orange-500" />,
      label: "Trending",
      value: Math.floor(count * 0.3),
    },
    {
      icon: <FaStar className="text-yellow-500" />,
      label: "Top Rated",
      value: Math.floor(count * 0.15),
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {stats.map((stat, index) => (
        <StatCard key={stat.label} {...stat} delay={index * 0.1} />
      ))}
    </div>
  );
};

const GenreHeader = ({
  genre,
  onBack,
}: {
  genre: Genre;
  onBack: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`relative overflow-hidden rounded-2xl mb-8 ${genre.color}`}
  >
    <motion.div
      className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,_rgba(255,255,255,0.2),_transparent)] opacity-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.3, 0.5, 0.3] }}
      transition={{ duration: 3, repeat: Infinity }}
    />
    <div className="relative p-8">
      <motion.button
        onClick={onBack}
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
        className="mb-6 flex items-center gap-2 text-white/90 hover:text-white"
      >
        <FaArrowLeft />
        <span>Back to Genres</span>
      </motion.button>
      <div className="flex items-start gap-6">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-16 h-16 flex items-center justify-center bg-white/10 
          rounded-xl backdrop-blur-sm text-3xl"
        >
          {genre.icon}
        </motion.div>
        <div className="space-y-2">
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-4xl font-bold text-white"
          >
            {genre.name}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-white/80 max-w-2xl"
          >
            {genre.description}
          </motion.p>
        </div>
      </div>
    </div>
  </motion.div>
);

const GenreCard = ({
  genre,
  onClick,
}: {
  genre: Genre;
  onClick: () => void;
}) => (
  <motion.div
    whileHover={{ scale: 1.02, x: 10 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`p-4 rounded-xl cursor-pointer bg-gradient-to-br ${genre.color} 
    relative overflow-hidden group`}
  >
    <div className="flex items-center gap-4">
      <div
        className="w-12 h-12 flex items-center justify-center bg-white/10 
      rounded-lg backdrop-blur-sm text-2xl group-hover:scale-110 transition-transform"
      >
        {genre.icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-white">{genre.name}</h3>
        <p className="text-sm text-white/70 line-clamp-1">
          {genre.description}
        </p>
      </div>
    </div>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
      initial={false}
      whileHover={{ x: ["100%", "-100%"] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
  </motion.div>
);

const GenreList = ({
  onGenreSelect,
}: {
  onGenreSelect: (id: number) => void;
}) => (
  <div className="container mx-auto px-4 py-8 space-y-12">
    <motion.h1
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-4xl font-bold text-center text-white mb-8"
    >
      Explore Movie Genres
    </motion.h1>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {genreData.map((category, categoryIndex) => (
        <motion.div
          key={category.category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: categoryIndex * 0.1 }}
          className="space-y-4"
        >
          <h2 className="text-xl font-semibold text-white/90 mb-4">
            {category.category}
          </h2>
          <div className="grid gap-4">
            {category.genres.map((genre) => (
              <GenreCard
                key={genre.id}
                genre={genre}
                onClick={() => onGenreSelect(genre.id)}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

const GenreContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedGenre = Number(searchParams.get("selected")) || null;
  const { page } = useMovieList();
  const { filters } = usePersistedFilters(`genre_${selectedGenre}`);

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

  if (!selectedGenre) {
    return (
      <GenreList
        onGenreSelect={(id) => router.push(`/genres?selected=${id}`)}
      />
    );
  }

  if (isLoading) return <Loading />;
  if (!currentGenre) return <NoResults />;

  return (
    <div className="container mx-auto px-4 py-8">
      <GenreHeader genre={currentGenre} onBack={() => router.push("/genres")} />
      <GenreStats count={data?.total_results || 0} />
      {!filteredMovies?.length ? (
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
        </motion.div>
      )}
    </div>
  );
};

export default function GenresPage() {
  return (
    <Suspense fallback={<Loading />}>
      <GenreContent />
    </Suspense>
  );
}

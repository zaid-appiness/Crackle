import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Movie } from '@/types/movie';

interface WatchlistStore {
  movies: Movie[];
  addMovie: (movie: Movie) => void;
  removeMovie: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

export const useWatchlistStore = create<WatchlistStore>()(
  persist(
    (set, get) => ({
      movies: [],
      addMovie: (movie) => 
        set((state) => ({
          movies: [...state.movies, movie],
        })),
      removeMovie: (movieId) =>
        set((state) => ({
          movies: state.movies.filter((m) => m.id !== movieId),
        })),
      isInWatchlist: (movieId) => 
        get().movies.some((m) => m.id === movieId),
    }),
    {
      name: 'movie-watchlist',
    }
  )
); 
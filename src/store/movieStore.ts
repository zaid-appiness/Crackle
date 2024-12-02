import { create } from 'zustand';
import { Movie, MovieDetails } from '@/types/movie';

interface MovieStore {
  selectedMovie: MovieDetails | null;
  popularMovies: Movie[];
  topMovies: Movie[];
  loading: boolean;
  error: string | null;
  setSelectedMovie: (movie: MovieDetails | null) => void;
  setPopularMovies: (movies: Movie[]) => void;
  setTopMovies: (movies: Movie[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useMovieStore = create<MovieStore>((set) => ({
  selectedMovie: null,
  popularMovies: [],
  topMovies: [],
  loading: false,
  error: null,
  setSelectedMovie: (movie) => set({ selectedMovie: movie }),
  setPopularMovies: (movies) => set({ popularMovies: movies }),
  setTopMovies: (movies) => set({ topMovies: movies }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
})); 
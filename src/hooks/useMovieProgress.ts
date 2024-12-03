import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface MovieProgress {
  [movieId: number]: number; // Store progress percentage
}

interface ProgressStore {
  progress: MovieProgress;
  updateProgress: (movieId: number, progress: number) => void;
  getProgress: (movieId: number) => number;
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      progress: {},
      updateProgress: (movieId, progress) => 
        set((state) => ({
          progress: { ...state.progress, [movieId]: progress }
        })),
      getProgress: (movieId) => get().progress[movieId] || 0,
    }),
    {
      name: 'movie-progress',
    }
  )
); 
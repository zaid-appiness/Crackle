import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Rating {
  movieId: number;
  rating: number;
  timestamp: number;
}

interface RatingStore {
  ratings: Rating[];
  addRating: (movieId: number, rating: number) => void;
  getRating: (movieId: number) => number | null;
}

export const useRatingStore = create<RatingStore>()(
  persist(
    (set, get) => ({
      ratings: [],
      addRating: (movieId, rating) => 
        set((state) => ({
          ratings: [
            ...state.ratings.filter(r => r.movieId !== movieId),
            { movieId, rating, timestamp: Date.now() }
          ]
        })),
      getRating: (movieId) => {
        const rating = get().ratings.find(r => r.movieId === movieId);
        return rating ? rating.rating : null;
      },
    }),
    {
      name: 'movie-ratings',
    }
  )
); 
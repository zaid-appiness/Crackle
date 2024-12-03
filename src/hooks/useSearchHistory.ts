import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchHistoryStore {
  searches: string[];
  addSearch: (query: string) => void;
  clearHistory: () => void;
}

export const useSearchHistory = create<SearchHistoryStore>()(
  persist(
    (set) => ({
      searches: [],
      addSearch: (query) => 
        set((state) => ({
          searches: [query, ...state.searches.filter(s => s !== query)].slice(0, 5)
        })),
      clearHistory: () => set({ searches: [] }),
    }),
    {
      name: 'search-history',
    }
  )
); 
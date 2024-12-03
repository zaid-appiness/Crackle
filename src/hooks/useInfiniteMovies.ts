import { useInfiniteQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";
import { MovieResponse } from "@/types/movie";

export function useInfiniteMovies(type: "popular" | "trending" | "top-rated") {
  return useInfiniteQuery<MovieResponse, Error, MovieResponse, [string, string], number>({
    queryKey: ["movies", type],
    queryFn: ({ pageParam }) => {
      switch (type) {
        case "popular":
          return movieApi.getPopularMovies(pageParam);
        case "trending":
          return movieApi.getTrendingMovies();
        case "top-rated":
          return movieApi.getTopRatedMovies();
      }
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => 
      lastPage.page < lastPage.total_pages ? lastPage.page + 1 : undefined,
  });
} 
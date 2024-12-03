import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { movieApi } from "@/lib/api";

export function usePopularMovies(page = 1) {
  return useQuery({
    queryKey: ["movies", "popular", page],
    queryFn: () => movieApi.getPopularMovies(page),
    placeholderData: keepPreviousData,
  });
}

export function useTopRatedMovies() {
  return useQuery({
    queryKey: ["movies", "top-rated"],
    queryFn: () => movieApi.getTopRatedMovies(),
  });
}

export function useTrendingMovies() {
  return useQuery({
    queryKey: ["movies", "trending"],
    queryFn: () => movieApi.getTrendingMovies(),
  });
}

export function useMovieDetails(id: number) {
  return useQuery({
    queryKey: ["movie", id],
    queryFn: () => movieApi.getMovieDetails(id),
    enabled: !!id,
    staleTime: Infinity,
  });
}

export function useSimilarMovies(id: number) {
  return useQuery({
    queryKey: ["movie", id, "similar"],
    queryFn: () => movieApi.getSimilarMovies(id),
    enabled: !!id,
    staleTime: Infinity,
  });
} 
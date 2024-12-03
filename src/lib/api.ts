import axios from 'axios';
import { MovieResponse, MovieDetails } from '@/types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: process.env.NEXT_PUBLIC_API_KEY },
  headers: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  },
});

export const movieApi = {
  getPopularMovies: async (page: number = 1) => {
    try {
      const response = await api.get<MovieResponse>(`/movie/popular?page=${page}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular movies:', error);
      return { results: [], total_pages: 0, page: 1, total_results: 0 };
    }
  },

  getTopRatedMovies: async () => {
    const response = await api.get<MovieResponse>('/movie/top_rated?page=1');
    return response.data;
  },

  getMovieDetails: async (id: number) => {
    const response = await api.get<MovieDetails>(`/movie/${id}`);
    return response.data;
  },

  getSimilarMovies: async (id: number) => {
    const response = await api.get<MovieResponse>(`/movie/${id}/similar`);
    return response.data;
  },

  searchMovies: async (query: string) => {
    const response = await api.get<MovieResponse>('/search/movie', {
      params: {
        query,
      },
    });
    return response.data;
  },

  getTrendingMovies: async () => {
    const response = await api.get<MovieResponse>('/trending/movie/day');
    return response.data;
  },

  getMovieVideos: async (id: number) => {
    const response = await api.get<{
      results: {
        key: string;
        type: string;
        site: string;
      }[];
    }>(`/movie/${id}/videos`);
    return response.data.results.find(
      (video) => video.type === "Trailer" && video.site === "YouTube"
    );
  },
}; 
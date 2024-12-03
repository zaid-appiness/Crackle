import axios from 'axios';
import { MovieResponse, MovieDetails } from '@/types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const VIDSRC_BASE_URL = 'https://vidsrc.xyz/embed/movie';

const api = axios.create({
  baseURL: BASE_URL,
  params: { 
    api_key: process.env.NEXT_PUBLIC_API_KEY || ''
  },
  headers: {
    'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
  },
  timeout: 10000,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('API Key error:', error);
      return Promise.resolve({ 
        data: { results: [], total_pages: 0, page: 1, total_results: 0 } 
      });
    }
    return Promise.reject(error);
  }
);

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

  getMovieStream: async (tmdbId: number) => {
    // First try to get official trailer
    const trailerResponse = await api.get<{
      results: Array<{
        key: string;
        site: string;
        type: string;
        official: boolean;
      }>;
    }>(`/movie/${tmdbId}/videos`);

    const officialTrailer = trailerResponse.data.results.find(
      video => video.official && video.type === "Trailer" && video.site === "YouTube"
    );

    if (officialTrailer) {
      return {
        type: 'youtube',
        key: officialTrailer.key
      };
    }

    // Fallback to movie stream
    return {
      type: 'stream',
      url: `${VIDSRC_BASE_URL}/${tmdbId}`
    };
  },

  getMovieReviews: async (id: number) => {
    const response = await api.get<{ results: Array<{ id: string; content: string; author: string }> }>(
      `/movie/${id}/reviews`
    );
    return response.data;
  },

  getMovieRecommendations: async (id: number) => {
    const response = await api.get<MovieResponse>(`/movie/${id}/recommendations`);
    return response.data;
  },
}; 
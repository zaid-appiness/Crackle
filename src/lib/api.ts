import axios from 'axios';
import { MovieResponse, MovieDetails } from '@/types/movie';

const API_KEY = process.env.API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: { api_key: API_KEY },
});

export const movieApi = {
  getPopularMovies: async (page: number = 1) => {
    const response = await api.get<MovieResponse>(`/movie/popular?page=${page}`);
    return response.data;
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
  }
}; 
import { TMDBVideo } from "@/types/video";
import axios from "axios";

const api = axios.create({
  baseURL: "/api/movies",
});

const VIDSRC_BASE_URL = "https://vidsrc.xyz/embed/movie";

export const movieApi = {
  getPopularMovies: async (page: number = 1) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/popular?page=${page}`,
      },
    });
    return response.data;
  },

  getTopRatedMovies: async () => {
    const response = await api.get("", {
      params: {
        endpoint: "/movie/top_rated?page=1",
      },
    });
    return response.data;
  },

  getMovieDetails: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}`,
      },
    });
    return response.data;
  },

  getSimilarMovies: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}/similar`,
      },
    });
    return response.data;
  },

  searchMovies: async (query: string) => {
    const response = await api.get("", {
      params: {
        endpoint: `/search/movie?query=${query}`,
      },
    });
    return response.data;
  },

  getTrendingMovies: async () => {
    const response = await api.get("", {
      params: {
        endpoint: "/trending/movie/day",
      },
    });
    return response.data;
  },

  getMovieStream: async (tmdbId: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${tmdbId}/videos`,
      },
    });

    const officialTrailer = response.data.results.find(
      (video: TMDBVideo) =>
        video.official && video.type === "Trailer" && video.site === "YouTube"
    );

    if (officialTrailer) {
      return {
        type: "youtube",
        key: officialTrailer.key,
      };
    }

    return {
      type: "stream",
      url: `${VIDSRC_BASE_URL}/${tmdbId}`,
    };
  },

  getMovieReviews: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}/reviews`,
      },
    });
    return response.data;
  },

  getMovieRecommendations: async (id: number) => {
    const response = await api.get("", {
      params: {
        endpoint: `/movie/${id}/recommendations`,
      },
    });
    return response.data;
  },

  getMoviesByGenre: async (genreId: number, page: number = 1) => {
    const response = await api.get("", {
      params: {
        endpoint: `/discover/movie?with_genres=${genreId}&sort_by=popularity.desc&page=${page}`,
      },
    });
    return response.data;
  },
};

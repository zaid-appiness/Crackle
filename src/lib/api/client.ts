import axios, { AxiosError } from "axios";

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorResponseData {
  message?: string;
  error?: string;
}

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseData>) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("user");
      window.location.href = "/auth/login";
      return Promise.reject(new ApiError("Authentication required", 401));
    }

    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message;
    const status = error.response?.status || 500;
    const code = error.code;

    return Promise.reject(new ApiError(message, status, code));
  }
);

export { api };

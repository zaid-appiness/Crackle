import axios, { AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message);
    this.name = "ApiError";
  }
}

interface ErrorResponseData {
  message?: string;
}

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session?.user?.email) {
      config.headers.Authorization = `Bearer ${session.user.email}`;
    }
    return config;
  },
  (error) => Promise.reject(new ApiError(error.message, 500))
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ErrorResponseData>) => {
    if (error.response?.status === 401) {
      await signOut({ redirect: true, callbackUrl: "/auth/login" });
    }

    const message = error.response?.data?.message || error.message;
    const status = error.response?.status || 500;
    const code = error.code;

    throw new ApiError(message, status, code);
  }
);

export { api };

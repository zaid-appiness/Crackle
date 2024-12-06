"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (userData: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Check auth state on mount and route changes
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      const token = Cookies.get("token");
      const userData = localStorage.getItem("user");

      if (!token || !userData) {
        handleLogout();
        return;
      }

      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } catch (error) {
      console.error("Auth check error:", error);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  const login = (userData: User) => {
    try {
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      // Get the callback URL from the URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const callbackUrl = urlParams.get("callbackUrl");

      // Redirect to the callback URL or home
      if (callbackUrl) {
        router.push(decodeURIComponent(callbackUrl));
      } else {
        router.push("/home");
      }
    } catch (error) {
      console.error("Login error:", error);
      handleLogout();
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    Cookies.remove("token", { path: "/" });
    setUser(null);
  };

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      handleLogout();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Still clear local state even if API call fails
      handleLogout();
      router.push("/auth/login");
    }
  };

  const value = {
    user,
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

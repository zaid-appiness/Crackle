"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaEnvelope, FaLock } from "react-icons/fa";
import Link from "next/link";
import AlertMessage from "@/components/AlertMessage";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Login failed");
      }

      login(data.user);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-gray-900/50 p-8 rounded-2xl backdrop-blur-sm">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-400">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="font-medium text-blue-500 hover:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <AlertMessage
              type="error"
              message={error}
              onClose={() => setError(null)}
            />
          )}
        </AnimatePresence>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaEnvelope />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none relative block w-full px-10 py-3 bg-gray-800/50 
                border border-gray-700 placeholder-gray-400 text-white rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200"
                placeholder="Email address"
                required
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <FaLock />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none relative block w-full px-10 py-3 bg-gray-800/50 
                border border-gray-700 placeholder-gray-400 text-white rounded-xl
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                transition-all duration-200"
                placeholder="Password"
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-500 hover:text-blue-400 transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent 
              text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-700
              hover:from-blue-500 hover:to-blue-600 focus:outline-none focus:ring-2 
              focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <motion.div
                  className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
              ) : (
                "Sign in"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

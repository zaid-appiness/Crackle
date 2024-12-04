"use client";

import { motion } from "framer-motion";
import { FaBug, FaRedo, FaWifi } from "react-icons/fa";
import { useEffect, useState } from "react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      window.location.reload();
    };
    const handleOffline = () => setIsOffline(true);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-gray-900 to-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 max-w-md"
      >
        <motion.div
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="inline-block text-red-500 text-6xl"
        >
          {isOffline ? <FaWifi /> : <FaBug />}
        </motion.div>

        <h2 className="text-3xl font-bold text-white">
          {isOffline ? "You're Offline" : "Oops! Something went wrong"}
        </h2>
        <p className="text-gray-400">
          {isOffline
            ? "Please check your internet connection. We'll automatically reload when you're back online."
            : error.message ||
              "Don't worry, we're on it. Try refreshing the page."}
        </p>

        <motion.button
          onClick={() => window.location.reload()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white 
          rounded-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-200 
          flex items-center justify-center gap-2 mx-auto"
        >
          <FaRedo className="animate-spin-slow" />
          Reload Page
        </motion.button>
      </motion.div>
    </div>
  );
}

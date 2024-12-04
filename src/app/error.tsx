"use client";

import { motion } from "framer-motion";
import { FaBug, FaRedo } from "react-icons/fa";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
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
          <FaBug />
        </motion.div>

        <h2 className="text-3xl font-bold text-white">
          Oops! Something went wrong
        </h2>
        <p className="text-gray-400">
          {error.message ||
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

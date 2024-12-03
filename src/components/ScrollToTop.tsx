"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaArrowUp } from "react-icons/fa";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 500);
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 p-4 bg-gradient-to-r from-blue-600 to-blue-700 
          text-white rounded-full shadow-lg hover:shadow-blue-500/20 transition-shadow 
          duration-300 z-50 group"
        >
          <FaArrowUp className="text-xl group-hover:animate-bounce" />
          <div
            className="absolute -top-10 right-0 px-3 py-2 bg-gray-900 text-white text-sm 
          rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap"
          >
            Back to top
          </div>
        </motion.button>
      )}
    </AnimatePresence>
  );
}

"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookieConsent");
    if (!hasConsented) {
      setShowConsent(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };

  return (
    <AnimatePresence>
      {showConsent && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 
          backdrop-blur-sm border-t border-gray-800"
        >
          <div
            className="container mx-auto flex flex-col sm:flex-row items-center 
          justify-between gap-4"
          >
            <p className="text-gray-300 text-sm text-center sm:text-left">
              We use cookies to enhance your experience. By continuing to visit
              this site, you agree to our use of cookies.{" "}
              <a
                href="/privacy"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Learn more
              </a>
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                hover:bg-blue-500 transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

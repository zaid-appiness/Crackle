"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface CookieConsentProps {
  onAccept: () => void;
}

const CookieConsent = ({ onAccept }: CookieConsentProps) => {
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      setShowModal(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowModal(false);
    onAccept();
  };

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-zinc-900 p-8 rounded-xl shadow-2xl max-w-lg w-full mx-4 border border-zinc-700"
          >
            <h2 className="text-2xl font-bold mb-4">Cookie Consent</h2>
            <p className="text-gray-300 mb-6">
              We use cookies to enhance your experience on our website. By
              continuing to use this site, you agree to our use of cookies for
              analytics, personalized content, and ads.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={handleAccept}
                className="px-6 py-2 bg-primary hover:bg-primary/80 text-white rounded-lg 
                transition-colors duration-200 font-semibold"
              >
                Accept & Continue
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;

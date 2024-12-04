"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";
import ReactPlayer from "react-player/lazy";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface TrailerModalProps {
  videoId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TrailerModal({
  videoId,
  isOpen,
  onClose,
}: TrailerModalProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isOpen && !user) {
      const shouldLogin = window.confirm(
        "Please login to watch videos. Would you like to login now?"
      );
      if (shouldLogin) {
        router.push("/auth/login");
      }
      onClose();
    }
  }, [isOpen, user, router, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white 
              hover:bg-black/80 z-10 transition-colors"
            >
              <FaTimes />
            </button>
            <ReactPlayer
              url={`https://www.youtube.com/watch?v=${videoId}`}
              width="100%"
              height="100%"
              playing={true}
              controls={true}
              config={{
                youtube: {
                  playerVars: { showinfo: 1 },
                },
              }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

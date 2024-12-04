"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function LoadingBarContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [pathname, searchParams]);

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[3px]">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ scaleX: 0, opacity: 1 }}
            animate={{
              scaleX: 1,
              transition: { duration: 1, ease: "easeInOut" },
            }}
            exit={{
              opacity: 0,
              transition: { duration: 0.3 },
            }}
            style={{ originX: 0 }}
            className="h-full w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
            relative overflow-hidden shadow-[0_0_10px_rgba(99,102,241,0.5)]"
          >
            {/* Shimmer effect */}
            <motion.div
              animate={{
                x: ["0%", "100%"],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 0.8,
                repeat: Infinity,
                ease: "linear",
              }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent 
              skew-x-12"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function LoadingBar() {
  return (
    <Suspense fallback={null}>
      <LoadingBarContent />
    </Suspense>
  );
}

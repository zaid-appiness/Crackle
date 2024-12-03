"use client";

import { motion, AnimatePresence } from "framer-motion";
import ErrorBoundary from "./ErrorBoundary";
import QueryProvider from "./QueryProvider";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <QueryProvider>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </QueryProvider>
    </ErrorBoundary>
  );
}

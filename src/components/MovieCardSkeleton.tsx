"use client";

import { motion } from "framer-motion";

export default function MovieCardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative aspect-[2/3] rounded-lg overflow-hidden"
    >
      <div className="absolute inset-0 bg-gray-800 animate-pulse" />
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
      </div>
    </motion.div>
  );
}

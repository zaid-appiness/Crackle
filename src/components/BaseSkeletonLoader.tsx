"use client";

import { motion } from "framer-motion";
import { cn } from "@/utils/helpers";

interface BaseSkeletonLoaderProps {
  className?: string;
  animate?: boolean;
  children?: React.ReactNode;
  variant?: "pulse" | "shimmer" | "gradient";
}

export default function BaseSkeletonLoader({
  className,
  animate = true,
  children,
  variant = "pulse",
}: BaseSkeletonLoaderProps) {
  const baseClass = "bg-gray-800 rounded-lg";
  const animationClass = {
    pulse: "animate-pulse",
    shimmer:
      "animate-shimmer bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800",
    gradient:
      "animate-gradient-slow bg-gradient-to-r from-gray-800 to-gray-700",
  }[variant];

  if (!animate) {
    return <div className={cn(baseClass, className)}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={cn(baseClass, animationClass, className)}
    >
      {children}
      {variant === "shimmer" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{ x: ["100%", "-100%"] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      )}
    </motion.div>
  );
}

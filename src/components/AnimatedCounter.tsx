"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, animate } from "framer-motion";

interface AnimatedCounterProps {
  value: string;
  duration?: number;
}

export default function AnimatedCounter({
  value,
  duration = 2,
}: AnimatedCounterProps) {
  const nodeRef = useRef<HTMLSpanElement>(null);
  const isInView = useInView(nodeRef, { once: true, margin: "-100px" });
  const numberValue = parseInt(value.replace(/\D/g, ""));

  useEffect(() => {
    if (isInView && nodeRef.current) {
      const node = nodeRef.current;

      const controls = animate(0, numberValue, {
        duration,
        onUpdate(value) {
          node.textContent = Math.round(value).toString();
        },
        ease: "easeOut",
      });

      return () => controls.stop();
    }
  }, [isInView, numberValue, duration]);

  return (
    <motion.div className="relative inline-flex items-center justify-center">
      <motion.span
        ref={nodeRef}
        className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      >
        0
      </motion.span>
      {value.includes("+") && (
        <motion.span
          initial={{ scale: 0, rotate: -45 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: duration, type: "spring" }}
          className="inline-block ml-1 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"
        >
          +
        </motion.span>
      )}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={isInView ? { scale: [1.2, 0], opacity: [1, 0] } : {}}
        transition={{ duration: 0.5, delay: duration * 0.8 }}
        className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 
        rounded-full blur-xl"
      />
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { FaExclamationCircle, FaCheckCircle, FaTimes } from "react-icons/fa";

interface AlertMessageProps {
  message: string;
  type: "error" | "success";
  onClose?: () => void;
}

export default function AlertMessage({
  message,
  type,
  onClose,
}: AlertMessageProps) {
  const bgColor = type === "error" ? "bg-red-500/10" : "bg-green-500/10";
  const borderColor =
    type === "error" ? "border-red-500/20" : "border-green-500/20";
  const textColor = type === "error" ? "text-red-500" : "text-green-500";
  const Icon = type === "error" ? FaExclamationCircle : FaCheckCircle;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={`${bgColor} ${borderColor} ${textColor} px-4 py-3 rounded-lg border relative`}
    >
      <div className="flex items-center gap-2">
        <Icon className="text-lg shrink-0" />
        <span className="text-sm font-medium">{message}</span>
        {onClose && (
          <button
            onClick={onClose}
            className="ml-auto hover:opacity-70 transition-opacity"
          >
            <FaTimes />
          </button>
        )}
      </div>
    </motion.div>
  );
}

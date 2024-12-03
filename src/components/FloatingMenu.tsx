"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { FaPlus, FaHeart, FaShare, FaBookmark } from "react-icons/fa";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { icon: <FaHeart />, label: "Favorites", color: "bg-red-500" },
    { icon: <FaBookmark />, label: "Watchlist", color: "bg-blue-500" },
    { icon: <FaShare />, label: "Share", color: "bg-green-500" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {menuItems.map((item, index) => (
              <motion.button
                key={item.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`${item.color} p-3 rounded-full text-white shadow-lg 
                hover:scale-110 transition-transform flex items-center gap-2`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 p-4 rounded-full text-white shadow-lg"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        animate={{ rotate: isOpen ? 45 : 0 }}
      >
        <FaPlus className="text-xl" />
      </motion.button>
    </div>
  );
}

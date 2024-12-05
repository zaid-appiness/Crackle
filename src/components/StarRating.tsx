import { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";

interface StarRatingProps {
  value: number;
  onChange: (rating: number) => void;
  max?: number;
  multiplier?: number;
}

export default function StarRating({
  value,
  onChange,
  max = 5,
  multiplier = 2,
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState<number | null>(null);

  return (
    <div className="flex items-center justify-between px-4">
      {[...Array(max)].map((_, index) => {
        const rating = (index + 1) * multiplier;
        const isSelected = value >= rating;
        const isHovered = hoveredRating !== null && rating <= hoveredRating;

        return (
          <motion.button
            key={rating}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onChange(rating === value ? 0 : rating)}
            onMouseEnter={() => setHoveredRating(rating)}
            onMouseLeave={() => setHoveredRating(null)}
            className="relative group"
          >
            <motion.div
              animate={{
                scale: isSelected || isHovered ? [1, 1.2, 1] : 1,
                rotate: isSelected ? [0, 15, 0] : 0,
              }}
              transition={{ duration: 0.3 }}
            >
              <FaStar
                className={`text-4xl transition-colors duration-300 ${
                  isSelected
                    ? "text-yellow-500"
                    : isHovered
                    ? "text-yellow-500/70"
                    : "text-gray-600"
                }`}
              />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: isHovered ? 1 : 0,
                y: isHovered ? 0 : 10,
              }}
              className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 
              text-white text-xs py-1 px-2 rounded whitespace-nowrap"
            >
              {rating.toFixed(1)}+
            </motion.div>
          </motion.button>
        );
      })}
    </div>
  );
}

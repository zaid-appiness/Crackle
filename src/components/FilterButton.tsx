import { motion } from "framer-motion";
import { filterButtonStyles } from "@/utils/constants";

interface FilterButtonProps {
  onClick: () => void;
  isSelected?: boolean;
  gradient?: string;
  children: React.ReactNode;
}

export function FilterButton({
  onClick,
  isSelected,
  gradient,
  children,
}: FilterButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`${filterButtonStyles.base} ${
        isSelected
          ? `bg-gradient-to-r ${gradient} ${filterButtonStyles.active}`
          : filterButtonStyles.inactive
      }`}
    >
      {children}
    </motion.button>
  );
}

interface ClearButtonProps {
  onClick: () => void;
  children?: React.ReactNode;
}

export function ClearButton({ onClick, children = "Clear" }: ClearButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={filterButtonStyles.clearButton}
    >
      {children}
    </motion.button>
  );
}

interface ExploreButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}

export function ExploreButton({ onClick, icon, children }: ExploreButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={filterButtonStyles.exploreButton}
    >
      <span className="text-lg group-hover:rotate-12 transition-transform">
        {icon}
      </span>
      {children}
    </motion.button>
  );
}

interface ResetButtonProps {
  onClick: () => void;
  isActive: boolean;
}

export function ResetButton({ onClick, isActive }: ResetButtonProps) {
  if (!isActive) return null;

  return (
    <motion.button
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={filterButtonStyles.resetButton}
    >
      <motion.span
        animate={{ rotate: isActive ? [0, -360] : 0 }}
        transition={{ duration: 0.5 }}
        className="text-lg"
      >
        ↺
      </motion.span>
      Reset Filters
    </motion.button>
  );
}

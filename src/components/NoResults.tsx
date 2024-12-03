import { motion } from "framer-motion";
import { FaFilter } from "react-icons/fa";

interface NoResultsProps {
  message?: string;
  subMessage?: string;
}

export default function NoResults({
  message = "No movies match your filters",
  subMessage = "Try adjusting your filters or search criteria",
}: NoResultsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center min-h-[50vh] space-y-6 px-4 text-center"
    >
      <div className="relative">
        <FaFilter className="text-6xl text-gray-700 transform -rotate-12" />
        <motion.div
          className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
        />
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-semibold text-gray-300">{message}</p>
        <p className="text-gray-500">{subMessage}</p>
      </div>
    </motion.div>
  );
}

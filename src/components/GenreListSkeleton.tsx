import { motion } from "framer-motion";

export default function GenreListSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-4xl font-bold text-center text-white mb-8">
        <div className="h-12 w-64 bg-gray-800 rounded-lg animate-pulse mx-auto" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {[...Array(2)].map((_, categoryIndex) => (
          <div key={categoryIndex} className="space-y-4">
            <h2 className="text-xl font-semibold text-white/90 mb-4">
              <div className="h-6 w-48 bg-gray-800 rounded animate-pulse" />
            </h2>
            <div className="grid gap-4">
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="relative p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse overflow-hidden"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-600 rounded-lg" />
                    <div className="flex-1 space-y-2">
                      <div className="h-5 w-32 bg-gray-600 rounded" />
                      <div className="h-4 w-48 bg-gray-600/50 rounded" />
                    </div>
                  </div>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0"
                    initial={false}
                    animate={{ x: ["100%", "-100%"] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function MovieFiltersSkeleton() {
  return (
    <div className="space-y-8 p-6 bg-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-800/50">
      {/* Rating Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 bg-gray-800 rounded animate-pulse" />
          <div className="h-5 w-32 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="h-8 w-8 bg-gray-800 rounded-full animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Trending Genres Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-800 rounded animate-pulse" />
            <div className="h-5 w-36 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-24 bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* All Genres Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-5 w-5 bg-gray-800 rounded animate-pulse" />
            <div className="h-5 w-28 bg-gray-800 rounded animate-pulse" />
          </div>
          <div className="h-5 w-16 bg-gray-800 rounded animate-pulse" />
        </div>
        <div className="flex flex-wrap gap-2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-9 w-20 bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>

      {/* Reset Button */}
      <div className="h-10 w-full bg-gray-800 rounded-lg animate-pulse" />
    </div>
  );
}

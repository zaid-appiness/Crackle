import MovieGridSkeleton from "./MovieGridSkeleton";

export default function GenrePageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="h-10 w-64 bg-gray-800 rounded-lg animate-pulse mx-auto" />
        <div className="h-6 w-96 bg-gray-800/50 rounded-lg animate-pulse mx-auto" />
      </div>

      {/* Genre Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Action & Adventure */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-800 rounded animate-pulse" />
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-gray-600 rounded" />
                    <div className="h-4 w-48 bg-gray-600/50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Drama & Romance */}
        <div className="space-y-4">
          <div className="h-6 w-48 bg-gray-800 rounded animate-pulse" />
          <div className="grid gap-4">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="p-4 rounded-xl bg-gradient-to-br from-gray-800 to-gray-700 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-600 rounded-lg" />
                  <div className="flex-1 space-y-2">
                    <div className="h-5 w-32 bg-gray-600 rounded" />
                    <div className="h-4 w-48 bg-gray-600/50 rounded" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Genre View */}
      <div className="space-y-8">
        {/* Genre Header */}
        <div className="relative overflow-hidden rounded-2xl">
          <div className="p-8 space-y-6 bg-gradient-to-r from-gray-800 to-gray-700 animate-pulse">
            {/* Back Button */}
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 bg-gray-600 rounded-full" />
              <div className="h-5 w-24 bg-gray-600 rounded" />
            </div>

            {/* Genre Title */}
            <div className="space-y-2">
              <div className="h-8 w-48 bg-gray-600 rounded" />
              <div className="h-4 w-64 bg-gray-600/50 rounded" />
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="bg-gray-900/50 backdrop-blur-sm p-4 rounded-xl space-y-2"
                >
                  <div className="h-6 w-16 bg-gray-600 rounded" />
                  <div className="h-4 w-24 bg-gray-600/50 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        <MovieGridSkeleton />
      </div>
    </div>
  );
}

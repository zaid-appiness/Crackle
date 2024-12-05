export default function MovieDetailSkeleton() {
  return (
    <div className="min-h-screen space-y-12">
      {/* Hero Section */}
      <div className="relative h-[70vh] w-full overflow-hidden bg-black">
        {/* Backdrop Skeleton */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 animate-gradient-slow" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black" />
        </div>

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex items-center">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Poster */}
            <div className="w-64 aspect-[2/3] rounded-xl bg-gray-800 animate-pulse" />

            {/* Info */}
            <div className="flex-1 space-y-6">
              {/* Title */}
              <div className="space-y-4">
                <div className="h-8 w-3/4 bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-6 w-1/2 bg-gray-800/50 rounded-lg animate-pulse" />
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap gap-4">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-8 w-24 bg-gray-800/30 rounded-full animate-pulse"
                  />
                ))}
              </div>

              {/* Overview */}
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-4 bg-gray-800/50 rounded animate-pulse"
                    style={{ width: `${85 - i * 15}%` }}
                  />
                ))}
              </div>

              {/* Buttons */}
              <div className="flex gap-4 pt-4">
                <div className="h-12 w-36 bg-gray-800 rounded-lg animate-pulse" />
                <div className="h-12 w-36 bg-gray-800/50 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Details Section */}
      <div className="container mx-auto px-4 grid md:grid-cols-3 gap-8">
        {/* Cast & Crew */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                <div className="h-3 w-20 bg-gray-800/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="h-4 w-24 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-32 bg-gray-800/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="space-y-4">
          <div className="h-6 w-32 bg-gray-800 rounded animate-pulse mb-6" />
          <div className="grid grid-cols-2 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="p-4 bg-gray-800/20 rounded-lg space-y-2">
                <div className="h-8 w-16 bg-gray-800 rounded animate-pulse" />
                <div className="h-4 w-24 bg-gray-800/50 rounded animate-pulse" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Similar Movies Section */}
      <div className="container mx-auto px-4 space-y-6">
        <div className="h-6 w-48 bg-gray-800 rounded animate-pulse" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-gray-800 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

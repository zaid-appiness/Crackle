"use client";

export default function HeroSkeleton() {
  return (
    <div className="relative h-[85vh] w-full overflow-hidden bg-black">
      {/* Animated Background with Gradient */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-blue-900/20 to-purple-900/20 animate-gradient-slow" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-gray-900 to-black" />
      </div>

      {/* Content */}
      <div className="relative h-full container mx-auto px-4 flex items-center">
        <div className="max-w-2xl space-y-8">
          {/* Title Skeleton with Gradient */}
          <div className="space-y-3">
            <div className="h-8 w-3/4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg animate-shimmer" />
            <div className="h-8 w-2/3 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded-lg animate-shimmer delay-75" />
          </div>

          {/* Rating Badge Skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-8 w-24 bg-yellow-900/20 rounded-full animate-pulse border border-yellow-800/30" />
            <div className="h-8 w-32 bg-blue-900/20 rounded-full animate-pulse border border-blue-800/30" />
          </div>

          {/* Overview Skeleton with Staggered Animation */}
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-4 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 rounded animate-shimmer"
                style={{
                  width: `${100 - i * 15}%`,
                  animationDelay: `${i * 150}ms`,
                }}
              />
            ))}
          </div>

          {/* Button Skeletons with Glow Effect */}
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 bg-red-900/20 rounded-lg animate-glow border border-red-800/30" />
            <div className="h-12 w-36 bg-gray-800/50 rounded-lg animate-glow delay-75 border border-gray-700/30" />
          </div>
        </div>

        {/* Poster Skeleton with Floating Animation */}
        <div className="hidden lg:block absolute right-12 bottom-[-10%] w-64 aspect-[2/3]">
          <div className="relative w-full h-full">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg transform -rotate-6 animate-float" />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-800/50 to-transparent rounded-lg transform -rotate-3 animate-float delay-100" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PageHeaderSkeleton() {
  return (
    <div className="space-y-4">
      {/* Title and Subtitle */}
      <div className="space-y-2">
        <div className="h-8 w-48 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-4 w-64 bg-gray-800/50 rounded-lg animate-pulse" />
      </div>

      {/* Filter Button Skeleton */}
      <div className="flex items-center gap-4">
        <div className="h-10 w-32 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

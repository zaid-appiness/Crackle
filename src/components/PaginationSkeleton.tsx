export default function PaginationSkeleton() {
  return (
    <div className="flex justify-center items-center gap-2 py-8">
      {/* Previous Button */}
      <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse" />

      {/* Page Numbers */}
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="h-10 w-10 bg-gray-800 rounded-lg animate-pulse"
          />
        ))}
      </div>

      {/* Next Button */}
      <div className="h-10 w-24 bg-gray-800 rounded-lg animate-pulse" />
    </div>
  );
}

export default function MovieGridSkeleton() {
  return (
    <div
      className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 
    sm:gap-4 md:gap-6"
    >
      {[...Array(12)].map((_, index) => (
        <div
          key={index}
          className="relative aspect-[2/3] rounded-lg overflow-hidden bg-gray-800 animate-pulse"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 space-y-2">
            <div className="h-4 bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-700 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

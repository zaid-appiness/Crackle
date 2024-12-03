export default function MovieGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {[...Array(10)].map((_, index) => (
        <div
          key={index}
          className="relative aspect-[2/3] rounded-lg overflow-hidden"
        >
          <div className="absolute inset-0 bg-gray-800 animate-pulse" />
          <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
            <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
            <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

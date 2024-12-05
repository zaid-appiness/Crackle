import MovieGridSkeleton from "./MovieGridSkeleton";

export default function SearchPageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Search Info */}
      <div className="space-y-4">
        <div className="h-8 w-64 bg-gray-800 rounded-lg animate-pulse" />
        <div className="h-4 w-48 bg-gray-800/50 rounded-lg animate-pulse" />
      </div>

      {/* Search Results */}
      <MovieGridSkeleton />
    </div>
  );
}

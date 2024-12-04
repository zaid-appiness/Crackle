"use client";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getVisiblePages = () => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        i === currentPage ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="flex justify-center items-center gap-2 py-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 md:px-4 py-2 bg-gray-800 text-white text-sm rounded-lg disabled:opacity-50 
        disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        Previous
      </button>

      <div className="flex flex-wrap items-center gap-2">
        {getVisiblePages().map((pageNum, index) => (
          <div key={index}>
            {pageNum === "..." ? (
              <span className="text-gray-400 px-2">{pageNum}</span>
            ) : (
              <button
                onClick={() => onPageChange(Number(pageNum))}
                className={`px-3 md:px-4 py-2 text-sm rounded-lg transition-colors ${
                  pageNum === currentPage
                    ? "bg-blue-600 text-white"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                {pageNum}
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 md:px-4 py-2 bg-gray-800 text-white text-sm rounded-lg disabled:opacity-50 
        disabled:cursor-not-allowed hover:bg-gray-700 transition-colors"
      >
        Next
      </button>
    </div>
  );
}

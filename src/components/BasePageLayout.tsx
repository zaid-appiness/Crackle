"use client";

import { motion } from "framer-motion";
import PageHeader from "./PageHeader";
import MovieGrid from "./MovieGrid";
import Pagination from "./Pagination";
import NoResults from "./NoResults";
import { FilterState } from "@/types/filters";
import { Movie } from "@/types/movie";
import PageHeaderSkeleton from "./PageHeaderSkeleton";
import MovieGridSkeleton from "./MovieGridSkeleton";
import PaginationSkeleton from "./PaginationSkeleton";

interface BasePageLayoutProps {
  title: string;
  subtitle: string;
  movies?: Movie[];
  isLoading?: boolean;
  prefix: string;
  page?: number;
  totalPages?: number;
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  onResetFilters?: () => void;
  onPageChange: (page: number) => void;
}

export default function BasePageLayout({
  title,
  subtitle,
  movies = [],
  isLoading = false,
  prefix,
  page = 1,
  totalPages = 1,
  filters,
  onFilterChange,
  onResetFilters,
  onPageChange,
}: BasePageLayoutProps) {
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHeaderSkeleton />
        <MovieGridSkeleton />
        <PaginationSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto px-4 py-8 space-y-8"
    >
      <PageHeader
        title={title}
        subtitle={subtitle}
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        initialFilters={filters}
      />

      {!movies?.length ? (
        <NoResults onReset={onResetFilters} />
      ) : (
        <>
          <MovieGrid movies={movies} prefix={prefix} />
          {totalPages > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={onPageChange}
            />
          )}
        </>
      )}
    </motion.div>
  );
}

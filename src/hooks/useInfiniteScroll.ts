"use client";

import { useEffect, useCallback } from "react";

export function useInfiniteScroll(
  loadMore: () => void,
  hasMore: boolean,
  loading: boolean
) {
  const handleScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight;
    const scrollTop = document.documentElement.scrollTop;
    const clientHeight = document.documentElement.clientHeight;

    if (scrollHeight - scrollTop <= clientHeight * 1.5 && !loading && hasMore) {
      loadMore();
    }
  }, [loadMore, hasMore, loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);
} 
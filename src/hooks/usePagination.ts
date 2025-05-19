import { useState, useMemo } from 'react';

interface PaginationResult {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  nextPage: () => void;
  prevPage: () => void;
  canNextPage: boolean;
  canPrevPage: boolean;
  pageNumbers: number[];
}

interface PaginationOptions {
  initialPage?: number;
  initialPageSize?: number;
  total: number;
  siblingCount?: number;
}

/**
 * Hook for handling pagination logic
 * 
 * @param options - Options including total items and initial values
 * @returns Object with pagination state and controls
 */
export function usePagination({
  initialPage = 1,
  initialPageSize = 10,
  total,
  siblingCount = 1
}: PaginationOptions): PaginationResult {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Recalculate if the current page is out of bounds after a page size change
  useMemo(() => {
    const totalPages = Math.ceil(total / pageSize);
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [pageSize, total, currentPage]);

  // Calculate total pages
  const totalPages = Math.ceil(total / pageSize);

  // Navigate functions
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  // Navigation states
  const canNextPage = currentPage < totalPages;
  const canPrevPage = currentPage > 1;

  // Generate page numbers array for pagination controls
  const pageNumbers = useMemo(() => {
    const totalPageNumbers = siblingCount * 2 + 3; // siblings + current + first + last
    
    // If pages are less than total numbers we want to show
    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    
    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      // Show more pages at the beginning
      const leftItemCount = 1 + 2 * siblingCount;
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, -1, totalPages];
    }
    
    if (shouldShowLeftDots && !shouldShowRightDots) {
      // Show more pages at the end
      const rightItemCount = 1 + 2 * siblingCount;
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1
      );
      return [1, -1, ...rightRange];
    }
    
    if (shouldShowLeftDots && shouldShowRightDots) {
      // Show dots on both sides
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i
      );
      return [1, -1, ...middleRange, -1, totalPages];
    }
    
    return [];
  }, [totalPages, currentPage, siblingCount]);

  return {
    currentPage,
    totalPages,
    pageSize,
    setCurrentPage,
    setPageSize,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
    pageNumbers,
  };
}

export default usePagination;
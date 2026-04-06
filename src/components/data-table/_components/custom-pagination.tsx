"use client";

import React, { useCallback } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
  prefix?: string;
  visiblePages?: number; // New configurable prop
}

export default function CustomPagination({
  currentPage,
  totalPages,
  prefix,
  visiblePages = 5, // Default to 5
}: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const getPageNumbers = useCallback(() => {
    const pages: (number | string)[] = [];

    // If total pages are less than or equal to what we want to show, show all
    if (totalPages <= visiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
      return pages;
    }

    // Dynamic logic for ellipsis and centering
    const sideNeighbors = Math.floor((visiblePages - 2) / 2); // Subtract first and last page
    let startPage = Math.max(2, currentPage - sideNeighbors);
    let endPage = Math.min(totalPages - 1, currentPage + sideNeighbors);

    // Adjust if near the start
    if (currentPage <= sideNeighbors + 1) {
      endPage = visiblePages - 1;
    }

    // Adjust if near the end
    if (currentPage >= totalPages - sideNeighbors) {
      startPage = totalPages - (visiblePages - 2);
    }

    pages.push(1); // Always show first

    if (startPage > 2) {
      pages.push("ellipsis-start");
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages - 1) {
      pages.push("ellipsis-end");
    }

    pages.push(totalPages); // Always show last

    return pages;
  }, [currentPage, totalPages, visiblePages]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(`${prefix ? prefix + "_" : ""}page`, page.toString());
      router.push(`?${params.toString()}`);
    },
    [prefix, router, searchParams],
  );

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>

        {/* Page Numbers & Ellipsis */}
        {pageNumbers.map((page, index) => {
          if (typeof page === "string") {
            return (
              <PaginationItem key={`${page}-${index}`}>
                <PaginationEllipsis />
              </PaginationItem>
            );
          }

          return (
            <PaginationItem key={page}>
              <PaginationLink
                onClick={() => handlePageChange(page)}
                isActive={currentPage === page}
                className="cursor-pointer"
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

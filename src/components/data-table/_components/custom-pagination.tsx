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
import { useRouter } from "next/navigation";

interface Props {
  currentPage: number;
  totalPages: number;
  prefix?: string;
}

export default function CustomPagination({ currentPage, totalPages, prefix }: Props) {
  const router = useRouter();
  const getPageNumbers = useCallback(() => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);

      if (currentPage <= 3) {
        // Near the beginning
        pages.push(2, 3, 4);
        pages.push("ellipsis-end");
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pages.push("ellipsis-start");
        pages.push(totalPages - 3, totalPages - 2, totalPages - 1);
      } else {
        // In the middle
        pages.push("ellipsis-start");
        pages.push(currentPage - 1, currentPage, currentPage + 1);
        pages.push("ellipsis-end");
      }

      // Always show last page
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const pageNumbers = getPageNumbers();

  const handlePrevious = useCallback(() => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  }, [currentPage]);

  const handleNext = useCallback(() => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  }, [currentPage]);

  const handlePageChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(window.location.search);
      params.set(`${prefix ? prefix + "_" : ""}page`, page.toString());
      router.push(`?${params.toString()}`);
    },
    [prefix]
  );

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={handlePrevious}
            className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
            title=""
          >
            <span className="sr-only">Previous</span>
          </PaginationPrevious>
        </PaginationItem>

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

        <PaginationItem>
          <PaginationNext
            onClick={handleNext}
            className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
          >
            <span className="sr-only">Next</span>
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

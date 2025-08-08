"use client";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ResponseMetaData } from "@/lib/definitions";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback } from "react";

export default function Pagination<TData>({ page, perPage, totalRecords, totalPages }: ResponseMetaData) {
  const router = useRouter();

  const handlePageChange = useCallback((value: any) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", value);
    router.push(`?${params.toString()}`);
  }, []);

  const handlePerPageChange = useCallback((value: any) => {
    const params = new URLSearchParams(window.location.search);
    params.set("perPage", value);
    router.push(`?${params.toString()}`);
  }, []);

  return (
    <div className="flex items-center justify-between px-4">
      <div className="text-muted-foreground hidden flex-1 text-sm lg:flex">
        {totalPages > 1 ? page * perPage : totalRecords} of {totalRecords} records.
      </div>
      <div className="flex w-full items-center gap-8 lg:w-fit">
        <div className="hidden items-center gap-2 lg:flex">
          <Label htmlFor="rows-per-page" className="text-sm font-medium">
            Rows per page
          </Label>
          <Select value={`${perPage}`} onValueChange={(value) => handlePerPageChange(value)}>
            <SelectTrigger size="sm" className="w-20" id="rows-per-page">
              <SelectValue placeholder={perPage} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-fit items-center justify-center text-sm font-medium">
          Page {page} of {totalPages}
        </div>
        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          <Button
            variant="outline"
            className="hidden h-8 w-8 p-0 lg:flex"
            onClick={() => handlePageChange(1)}
            disabled={page == 1}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => handlePageChange(page - 1)}
            disabled={page == 1}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            className="size-8"
            size="icon"
            onClick={() => handlePageChange(page + 1)}
            disabled={page == totalPages}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            className="hidden size-8 lg:flex"
            size="icon"
            onClick={() => handlePageChange(totalPages)}
            disabled={page == totalPages}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  );
}

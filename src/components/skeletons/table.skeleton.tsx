"use client";
import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Skeleton } from "../ui/skeleton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const TableSkeleton = () => {
  return (
    <>
      <div className="overflow-hidden rounded-lg border w-full">
        <Table className="[&_td]:py-1.5 [&_td]:px-3 [&_th]:py-2 [&_th]:px-3">
          <TableHeader className="bg-[#F9F7F1]">
            <TableRow>
              {[...Array(7)].map((_, index) => (
                <TableHead key={index}>
                  <Skeleton className="h-[30px] w-[100px] rounded-full" />
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8 bg-[#FFFDF8]">
            {[...Array(7)].map((_, i) => (
              <TableRow key={i}>
                {[...Array(7)].map((_, y) => (
                  <TableCell key={y}>
                    <Skeleton className="h-[30px] w-[100px] rounded-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="flex justify-center gap-1 mt-5 items-center">
        <ChevronLeft color="gray" />
        {[...Array(5)].map((_, y) => (
          <Skeleton key={y} className="h-[30px] w-[30px] rounded-full" />
        ))}
        <ChevronRight color="gray" />
      </div>
    </>
  );
};

export default TableSkeleton;

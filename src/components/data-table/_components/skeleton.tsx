"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import React from "react";

export const columns: ColumnDef<any>[] = [
  {
    id: "col1",
    header: () => (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    ),
    cell: () => (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    ),
  },
  {
    id: "col2",
    header: () => (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    ),
    cell: () => (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    ),
  },
  {
    id: "col3",
    header: () => (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    ),
    cell: () => (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    ),
  },
  {
    id: "col4",
    header: () => (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    ),
    cell: () => (
      <div className="flex items-center justify-center">
        <Skeleton className="h-[20px] w-[100px] rounded-full" />
      </div>
    ),
  },
];

export default function DataTableSkeleton() {
  const table = useReactTable({
    data: [{}, {}, {}, {}],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHeader className="bg-muted sticky top-0 z-10">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead key={header.id} colSpan={header.colSpan}>
                  {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody className="**:data-[slot=table-cell]:first:w-8">
        {table.getRowModel().rows?.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

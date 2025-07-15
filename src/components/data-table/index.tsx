"use client";

import { ColumnDef, flexRender, getCoreRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponseMetaData } from "@/lib/definitions";
import Pagination from "./_components/pagination";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  actions: {
    create?: any;
    update?: any;
    delete?: any;
  };
  initialStale: any;
  createButtonText: string;
  currentPath: string;
  data: {
    items: TData[];
    meta?: ResponseMetaData;
  };
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data: props.data.items,
    columns: props.columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full flex flex-col justify-start gap-6">
      <div className="flex items-center gap-2 justify-end w-full p-0">
        <Link href={`${props.currentPath}/ajouter`}>
          <Button>
            <Plus />
            {props.createButtonText}
          </Button>
        </Link>
      </div>
      <div className="overflow-hidden rounded-lg border">
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
                <TableCell colSpan={props.columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {props.data.meta && (
        <Pagination
          page={props.data.meta.page}
          perPage={props.data.meta.perPage}
          totalRecords={props.data.meta.totalRecords}
          totalPages={props.data.meta.totalPages}
        />
      )}
    </div>
  );
}

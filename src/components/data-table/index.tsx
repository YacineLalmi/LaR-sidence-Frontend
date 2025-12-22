"use client";

import { ColumnDef, flexRender, getCoreRowModel, getSortedRowModel, useReactTable } from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ResponseMetaData } from "@/lib/definitions";
import Pagination from "./_components/pagination";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: {
    items: any[];
    meta?: ResponseMetaData;
  };
  rowClassName?: string;
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const t = useTranslations();
  const table = useReactTable({
    data: props.data.items,
    columns: props.columns,
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),

    onSortingChange: (e) => console.log(e),
    manualSorting: true,
  });

  return (
    <div className="w-full flex flex-col justify-start gap-6">
      <div className="overflow-hidden rounded-lg border w-full">
        <Table className="w-full">
          <TableHeader className="bg-[#F9F7F1]">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      colSpan={header.colSpan}
                      style={{ width: `${header.getSize()}px` }}
                      className="font-bold text-[14px] text-wrap"
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="**:data-[slot=table-cell]:first:w-8 bg-[#FFFDF8]">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("text-[16px]", props.rowClassName)}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} style={{ width: `${cell.column.getSize()}px` }} className="text-wrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={props.columns.length} className="h-24 text-center">
                  {t("common.noDataFound")}
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

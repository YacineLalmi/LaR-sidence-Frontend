"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
} from "@tanstack/react-table";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FormState, ResponseMetaData } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { cn, customToast } from "@/lib/utils";
import CustomPagination from "./_components/custom-pagination";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { useCallback, useEffect, useState } from "react";
import { DeleteConfirmationDialog } from "../ui/delete-confirmation-dialog";
import CustomButton from "../ui/custom-button";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: {
    items: any[];
    meta?: ResponseMetaData;
  };
  rowClassName?: string;
  cellClassName?: string;
  paginationPrefix?: string;
  onDeleteMultiple?: (ids: number[]) => Promise<FormState>;
  footer?: {
    left?: React.ReactNode;
    right?: React.ReactNode;
  };
}

export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const translation = useTranslations();
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isDeleteManyDialogOpen, setIsDeleteManyDialogOpen] = useState<boolean>(false);
  const router = useRouter();

  const table = useReactTable({
    data: props.data.items,
    columns: props.columns,
    state: {
      rowSelection,
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: (e) => console.log(e),
    manualSorting: true,
  });

  // Clear selection when page data changes
  useEffect(() => {
    setRowSelection({});
  }, [props.data.meta?.page]);

  const selectedRows = table.getFilteredSelectedRowModel().rows;

  const handleDeleteMany = useCallback(async () => {
    const idsToDelete = selectedRows.map((row) => (row.original as any).id);
    if (props.onDeleteMultiple) {
      try {
        const response = await props.onDeleteMultiple(idsToDelete);
        if (response.isOk) {
          setIsDeleteManyDialogOpen(false);
          router.refresh();
          setRowSelection({});
          customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
        } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
      } catch (error) {
        customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
      }
    }
  }, [props.onDeleteMultiple, selectedRows]);

  return (
    <div className="w-full flex flex-col justify-start gap-6">
      <div className="overflow-hidden rounded-lg border w-full">
        <Table className="[&_td]:py-1.5 [&_td]:px-3 [&_th]:py-2 [&_th]:px-3">
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
                    <TableCell key={cell.id} className={cn(props.cellClassName)}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={props.columns.length} className="h-24 text-center">
                  {translation(TRANSLATIONS_KEYS.COMMON.NO_DATA_FOUND)}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between">
        <div className="w-2/12 flex justify-start">{props.footer && props.footer.left}</div>
        <div className="w-8/12">
          {props.data.meta && (
            <CustomPagination
              currentPage={props.data.meta.page}
              totalPages={props.data.meta.totalPages}
              prefix={props.paginationPrefix}
            />
          )}
        </div>
        <div className="w-2/12 flex justify-end">
          <DeleteConfirmationDialog
            title={translation(TRANSLATIONS_KEYS.COMMON.DELETE_SELECTION_MESSAGE, { count: selectedRows.length })}
            isOpen={isDeleteManyDialogOpen}
            setIsOpen={setIsDeleteManyDialogOpen}
            onConfirm={handleDeleteMany}
            trigger={
              <CustomButton
                text={translation(TRANSLATIONS_KEYS.COMMON.DELETE_SELECTION)}
                Icon={Trash2}
                variant="destructive"
                disabled={selectedRows.length === 0}
                className=" cursor-pointer rounded-sm p-0.5 bg-red-200 hover:bg-red-300 text-red-400 hover:text-red-500 disabled:bg-red-100"
              />
            }
          />
        </div>
      </div>
    </div>
  );
}

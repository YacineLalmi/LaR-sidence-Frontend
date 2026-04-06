"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { PaginatedResponse } from "@/lib/definitions";
import { BienType } from "@/schemas/bien-type/bien-type.schema";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { useCallback } from "react";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { deleteClassificationsAction } from "@/actions/classification/delete-classifications.action";
import { ListItem } from "@/schemas/global.schema";
import { formatId } from "@/lib/utils";
import DeleteTransactionTypeDialog from "./delete-transaction-type-dialog";
import UpdateTransactionTypeDialog from "./update-transaction-type-dialog";

interface Props {
  data: PaginatedResponse<Classification>;
  colors: ListItem[];
}

export default function TransactionTypeTable({ data, colors }: Props) {
  const translation = useTranslations();
  const locale = useLocale() as "fr" | "en" | "ar";

  const onDeleteMultiple = useCallback(async (ids: string[]) => {
    return await deleteClassificationsAction(CATEGORIES.TYPE, SCOPES.TRANSACTION, ids);
  }, []);

  const columns: ColumnDef<Classification>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
    },
    {
      accessorKey: "id",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.COLUMNS.ID)}
            columnKey="id"
          />
        );
      },
      cell: ({ row }) => <span>{formatId(row.original.id)}</span>,
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.COLUMNS.CODE),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.COLUMNS.NAME),
      cell: ({ row }) => <span className="font-medium">{row.original.name[locale]}</span>,
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.COLUMNS.DESCRIPTION),
      cell: ({ row }) => (
        <span className="font-medium max-w-24 truncate text-sm">{row.original.description[locale]}</span>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.COLUMNS.CREATED_AT)}
            columnKey="created_at"
          />
        );
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "P");
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center">
          <DeleteTransactionTypeDialog classification={row.original} />
          <UpdateTransactionTypeDialog classification={row.original} colors={colors} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} onDeleteMultiple={onDeleteMultiple} />;
}

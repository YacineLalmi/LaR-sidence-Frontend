"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { useCallback } from "react";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { deleteClassificationsAction } from "@/actions/classification/delete-classifications.action";
import { ListItem } from "@/schemas/global.schema";
import { formatId } from "@/lib/utils";
import DeleteClientSourceDialog from "./delete-client-source-dialog";
import UpdateClientSourceDialog from "./update-client-source-dialog";

interface Props {
  data: PaginatedResponse<Classification>;
}

export default function ClientSourceTable({ data }: Props) {
  const translation = useTranslations();
  const locale = useLocale() as "fr" | "en" | "ar";

  const onDeleteMultiple = useCallback(async (ids: string[]) => {
    return await deleteClassificationsAction(CATEGORIES.SOURCE, SCOPES.CLEINT, ids);
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
            columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.COLUMNS.ID)}
            columnKey="id"
          />
        );
      },
      cell: ({ row }) => <span>{formatId(row.original.id)}</span>,
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.COLUMNS.CODE),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.COLUMNS.NAME),
      cell: ({ row }) => <span className="font-medium">{row.original.name[locale]}</span>,
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.COLUMNS.DESCRIPTION),
      cell: ({ row }) => (
        <div className="font-medium max-w-24 truncate text-sm">{row.original.description[locale]}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.COLUMNS.CREATED_AT)}
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
          <DeleteClientSourceDialog classification={row.original} />
          <UpdateClientSourceDialog classification={row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.CLIENTS.SOURCES.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} onDeleteMultiple={onDeleteMultiple} />;
}

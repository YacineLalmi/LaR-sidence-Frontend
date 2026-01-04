"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { ResponseMetaData } from "@/lib/definitions";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { ClientType } from "@/schemas/client-types/client-type.schema";
import UpdateClientTypeDialog from "./update-client-type-dialog";
import DeleteCientTypeDialog from "./delete-client-type-dialog";

interface Props {
  data: {
    items: ClientType[];
    meta?: ResponseMetaData;
  };
}

export default function ClientTypeTable({ data }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<ClientType>[] = [
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
          <SortingButton columnName={translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TYPES.COLUMNS.ID)} columnKey="id" />
        );
      },
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TYPES.COLUMNS.CODE),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TYPES.COLUMNS.NAME),
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TYPES.COLUMNS.DESCRIPTION),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TYPES.COLUMNS.CREATED_AT)}
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
      cell: (row) => (
        <div className="flex items-center">
          <DeleteCientTypeDialog clientType={row.row.original} />
          <UpdateClientTypeDialog clientType={row.row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.TYPES.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

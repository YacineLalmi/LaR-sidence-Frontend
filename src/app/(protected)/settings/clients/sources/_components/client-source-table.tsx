"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { ResponseMetaData } from "@/lib/definitions";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import CustomButton from "@/components/ui/custom-button";
import { ClientSource } from "@/schemas/client-sources/client-source.schema";
import UpdateClientSourceDialog from "./update-client-source-dialog";
import DeleteClientSourceDialog from "./delete-client-source-dialog";

interface Props {
  data: {
    items: ClientSource[];
    meta?: ResponseMetaData;
  };
}

export default function ClientSourceTable({ data }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<ClientSource>[] = [
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
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.COLUMNS.ID)}
            columnKey="id"
          />
        );
      },
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.COLUMNS.CODE),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.COLUMNS.NAME),
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.COLUMNS.DESCRIPTION),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.COLUMNS.CREATED_AT)}
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
          <DeleteClientSourceDialog clientSource={row.row.original} />
          <UpdateClientSourceDialog clientSource={row.row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

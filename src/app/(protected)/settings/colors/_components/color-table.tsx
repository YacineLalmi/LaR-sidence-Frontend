"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { ResponseMetaData } from "@/lib/definitions";
import { Color } from "@/schemas/colors/color.schema";
import UpdateColorDialog from "./update-color-dialog";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import DeleteColorDialog from "./delete-color-dialog";

interface Props {
  data: {
    items: Color[];
    meta?: ResponseMetaData;
  };
}

export default function ColorTable({ data }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<Color>[] = [
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
        return <SortingButton columnName={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.COLUMNS.ID)} columnKey="id" />;
      },
    },
    {
      accessorKey: "background_color",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.COLUMNS.BACKGROUND_COLOR),
      cell: ({ row }) => (
        <span
          style={{ color: row.original.background_color, backgroundColor: "lightgrey" }}
          className="p-1 rounded-2xl"
        >
          {row.original.background_color}
        </span>
      ),
    },
    {
      accessorKey: "text_color",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.COLUMNS.TEXT_COLOR),
      cell: ({ row }) => (
        <span style={{ color: row.original.text_color, backgroundColor: "lightgrey" }} className="p-1 rounded-2xl">
          {row.original.text_color}
        </span>
      ),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.COLUMNS.NAME),
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.COLUMNS.DESCRIPTION),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.COLUMNS.CREATED_AT)}
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
        <div className="flex items-center gap-2">
          <DeleteColorDialog color={row.row.original} />
          <UpdateColorDialog color={row.row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

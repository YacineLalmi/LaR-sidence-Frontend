"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { ResponseMetaData } from "@/lib/definitions";
import { BienAdditionalcharacteristics } from "@/schemas/bien-additional-characteristics/bien-addtional-characteristics.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import UpdateBienCharacteristicsDialog from "./update-bien-characteristics-dialog";
import DeleteBienCharacteristicsDialog from "./delete-bien-characteristics-dialog";

interface Props {
  data: {
    items: BienAdditionalcharacteristics[];
    meta?: ResponseMetaData;
  };
}

export default function BienAdditionalcharacteristicsTable({ data }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<BienAdditionalcharacteristics>[] = [
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
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.COLUMNS.ID)}
            columnKey="id"
          />
        );
      },
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.COLUMNS.CODE),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.COLUMNS.NAME),
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.COLUMNS.DESCRIPTION),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.COLUMNS.CREATED_AT)}
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
          <DeleteBienCharacteristicsDialog bienCharacteristics={row.row.original} />
          <UpdateBienCharacteristicsDialog bienAdditionalcharacteristics={row.row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

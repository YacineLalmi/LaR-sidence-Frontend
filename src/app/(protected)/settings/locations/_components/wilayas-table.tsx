"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import UpdateWilayaDialog from "./update-wilaya-dialog";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";
import { ResponseMetaData } from "@/lib/definitions";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  data: {
    items: Wilaya[];
    meta?: ResponseMetaData;
  };
}

export default function WilayasTable({ data }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<Wilaya>[] = [
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
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.COLUMNS.NAME),
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.COLUMNS.CODE),
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <CustomButton Icon={Trash2} variant="ghost" className="!p-0" />
          <UpdateWilayaDialog wilaya={row.row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} cellClassName="!p-0" paginationPrefix="wilayas" />;
}

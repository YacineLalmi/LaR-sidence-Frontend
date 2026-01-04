"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";
import React from "react";
import { useTranslations } from "next-intl";
import { ResponseMetaData } from "@/lib/definitions";
import { Commune } from "@/schemas/communes/commune.schema";
import EditCommuneDialog from "./update-commune-dialog";
import { ListItem } from "@/schemas/Global.schema";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  wilayas: ListItem[];
  data: {
    items: Commune[];
    meta?: ResponseMetaData;
  };
}

export default function CommuneTable({ data, wilayas }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<Commune>[] = [
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
      header: translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.COLUMNS.NAME),
    },
    {
      accessorKey: "post_code",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.COLUMNS.POST_CODE),
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <CustomButton Icon={Trash2} variant="ghost" className="!p-0" />
          <EditCommuneDialog commune={row.row.original} wilayas={wilayas} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} cellClassName="!p-0" paginationPrefix="communes" />;
}

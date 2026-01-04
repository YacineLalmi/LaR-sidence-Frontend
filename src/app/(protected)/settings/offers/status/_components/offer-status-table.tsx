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
import { ListItem } from "@/schemas/Global.schema";
import { OfferStatus } from "@/schemas/offer-status/offer-status.schema";
import UpdateOfferStatusDialog from "./update-offer-status-dialog";
import DeleteOfferStatusDialog from "./delete-offer-status-dialog";

interface Props {
  colors: ListItem[];
  data: {
    items: OfferStatus[];
    meta?: ResponseMetaData;
  };
}

export default function OfferStatusTable({ data, colors }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<OfferStatus>[] = [
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
          <SortingButton columnName={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.COLUMNS.ID)} columnKey="id" />
        );
      },
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.COLUMNS.CODE),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.COLUMNS.NAME),
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.COLUMNS.DESCRIPTION),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.COLUMNS.CREATED_AT)}
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
          <DeleteOfferStatusDialog offerStatus={row.row.original} />
          <UpdateOfferStatusDialog offerStatus={row.row.original} colors={colors} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

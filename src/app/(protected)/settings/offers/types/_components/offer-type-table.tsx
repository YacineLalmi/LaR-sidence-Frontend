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
import UpdateOfferTypeDialog from "./update-offer-type-dialog";
import DeleteOfferBienDialog from "./delete-offer-type-dialog";
import DeleteOfferTypeDialog from "./delete-offer-type-dialog";
import { OfferType } from "@/schemas/offer-type/offer-type.schema";

interface Props {
  data: {
    items: OfferType[];
    meta?: ResponseMetaData;
  };
}

export default function OfferTypeTable({ data }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<OfferType>[] = [
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
          <SortingButton columnName={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.TYPES.COLUMNS.ID)} columnKey="id" />
        );
      },
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.TYPES.COLUMNS.CODE),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.TYPES.COLUMNS.NAME),
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.TYPES.COLUMNS.DESCRIPTION),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.TYPES.COLUMNS.CREATED_AT)}
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
          <DeleteOfferTypeDialog offerType={row.row.original} />
          <UpdateOfferTypeDialog offerType={row.row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.TYPES.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

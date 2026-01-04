"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Offer } from "@/schemas/offers/offer.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, File, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ResponseMetaData } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import DeleteOfferDialog from "./delete-offer-dialog";

interface Props {
  data: {
    items: Offer[];
    meta?: ResponseMetaData;
  };
}

export default function OffersTable({ data }: Props) {
  const t = useTranslations();

  const columns: ColumnDef<Offer>[] = [
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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("offers.columns.id"),
    },
    {
      accessorKey: "bien",
      header: t("offers.columns.bien"),
      cell: ({ row }) => {
        const bien = row.original.bien;
        return bien?.title || "-";
      },
    },
    {
      accessorKey: "client",
      header: t("offers.columns.client"),
      cell: ({ row }) => {
        const client = row.original.client;
        if (!client) return "-";
        const firstName = client.first_name || "";
        const lastName = client.last_name || "";
        return `${firstName} ${lastName}`.trim() || "-";
      },
    },
    {
      accessorKey: "type",
      header: t("offers.columns.type"),
      cell: ({ row }) => {
        const type = row.original.type;
        return type?.name || "-";
      },
    },
    {
      accessorKey: "created_at",
      header: t("offers.columns.createdAt"),
      cell: ({ row }) => {
        const date = row.original.created_at;
        if (!date) return "-";
        return new Date(date).toLocaleDateString("fr-FR");
      },
    },
    {
      accessorKey: "status",
      header: t("offers.columns.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        return status?.name || "-";
      },
    },
    {
      id: "document",
      cell: (row) => (
        <Button variant="ghost" size="sm" className="cursor-pointer" title="modifier">
          <File className="h-4 w-4" />
        </Button>
      ),
      header: "Fiche",
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DeleteOfferDialog offer={row.original} />
          <Link href={`/offers/${row.original.id}`}>
            <Button variant="ghost" size="sm" className="cursor-pointer" title="modifier">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
      header: "Actions",
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

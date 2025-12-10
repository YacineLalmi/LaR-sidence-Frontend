"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { ResponseMetaData } from "@/lib/definitions";
import { BienStatus } from "@/schemas/bien-status/bien-status.schema";

interface Props {
  data: {
    items: BienStatus[];
    meta?: ResponseMetaData;
  };
}

export default function BienStatusTable({ data }: Props) {
  const t = useTranslations();

  const columns: ColumnDef<BienStatus>[] = [
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
        return <SortingButton columnName={t("settings.bienStatus.columns.id")} columnKey="id" />;
      },
    },
    {
      accessorKey: "code",
      header: t("settings.bienStatus.columns.code"),
    },
    {
      accessorKey: "name",
      header: t("settings.bienStatus.columns.name"),
    },
    {
      accessorKey: "description",
      header: t("settings.bienStatus.columns.description"),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return <SortingButton columnName={t("settings.bienStatus.columns.createdAt")} columnKey="created_at" />;
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "P");
      },
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/settings/biens/status/${row.row.original.id}`}>
            <Button variant="ghost" size="sm" className="cursor-pointer" title="modifier">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            title="supprimer"
            // onClick={() => handleDelete(row.row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      header: "Actions",
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

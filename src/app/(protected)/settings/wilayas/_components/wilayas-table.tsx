"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { User } from "@/schemas/users/user.schema";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import UpdateWilayaDialog from "./update-dialog";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";
import { ResponseMetaData } from "@/lib/definitions";

interface Props {
  data: {
    items: Wilaya[];
    meta?: ResponseMetaData;
  };
}

export default function WilayasTable({ data }: Props) {
  const t = useTranslations();

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
      accessorKey: "id",
      header: () => {
        return <SortingButton columnName="ID Wilaya" columnKey="id" />;
      },
    },
    {
      accessorKey: "code",
      header: "Code Wilaya",
    },
    {
      accessorKey: "name",
      header: "Nom de Wilaya",
    },
    {
      accessorKey: "created_at",
      header: () => {
        return <SortingButton columnName="Date de création" columnKey="created_at" />;
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "P");
      },
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <UpdateWilayaDialog wilaya={row.row.original} />
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

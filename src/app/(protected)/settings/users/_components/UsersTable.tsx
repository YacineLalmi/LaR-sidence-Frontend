"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import Status from "@/components/ui/status";
import { useTranslations } from "next-intl";
import { User } from "@/schemas/users/user.schema";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";

interface Props {
  data: any;
}

export default function UsersTable({ data }: Props) {
  const t = useTranslations();

  const columns: ColumnDef<User>[] = [
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
        return <SortingButton columnName="ID Utilisateur" columnKey="id" />;
      },
    },
    {
      accessorKey: "username",
      header: "Nom Utilisateur",
    },
    {
      accessorKey: "last_name",
      header: "Nom",
    },
    {
      accessorKey: "first_name",
      header: "Prénom",
    },
    {
      accessorKey: "is_active",
      header: "Status",
      cell: ({ row }) => {
        return row.getValue("is_active") ? <Status value="Active" /> : <Status value="Inactive" color="bg-red-500" />;
      },
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
          <Link href={`/settings/users/${row.row.original.id}`}>
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

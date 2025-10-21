"use client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/schemas/users/user.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import BienHeader from "./BienHeader";
import { useTranslations } from "next-intl";

interface Props {
  data: any;
}

export default function BienTable({ data }: Props) {
  const t = useTranslations("biens");

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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: t("columns.id"),
    },
    {
      accessorKey: "title",
      header: t("columns.title"),
    },
    {
      accessorKey: "wilaya",
      header: t("columns.wilaya"),
    },
    {
      accessorKey: "commune",
      header: t("columns.commune"),
    },
    {
      accessorKey: "adresse",
      header: t("columns.adresse"),
    },
    {
      accessorKey: "is_active",
      header: t("columns.isActive"),
      cell: ({ row }) => (row.getValue("is_active") ? "Oui" : "Non"),
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/biens/${row.row.original.id}`}>
            <Button variant="ghost" size="sm" className="cursor-pointer" title="modifier">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            title="supprimer"
            onClick={() => {
              alert("delete " + row.row.original.id);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      header: "Actions",
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <BienHeader />
        <Link href="/biens/add">
          <Button className="cursor-pointer p-6 rounded-4xl flex gap-1 hover:bg-amber-200 hover:text-black hover:border-gray-600 border-1">
            <Plus />
            {t("create.buttonText")}
          </Button>
        </Link>
      </div>
      <div>
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}

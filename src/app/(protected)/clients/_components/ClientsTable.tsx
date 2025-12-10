"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/schemas/users/user.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ResponseMetaData } from "@/lib/definitions";
import { getTranslations } from "next-intl/server";
import { useTranslations } from "next-intl";
import ClientHeader from "./ClientHeader";
import { ListItem } from "@/schemas/Global.schema";
import { Client } from "@/schemas/clients/client.schema";

interface Props {
  data: {
    items: Client[];
    meta?: ResponseMetaData;
  };
    types: ListItem[];
    status: ListItem[];
    sources: ListItem[];
    genders: ListItem[];
}

export default function ClientTable({ data, types, status, sources, genders }: Props) {
  const t = useTranslations();

  const columns: ColumnDef<Client>[] = [
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
      header: t("clients.columns.id"),
    },
    {
      accessorKey: "first_name",
      header: t("clients.columns.firstName"),
    },
    {
      accessorKey: "last_name",
      header: t("clients.columns.lastName"),
    },
    {
      accessorKey: "gender",
      header: t("clients.columns.gender"),
    },
    {
      accessorKey: "created_at",
      header: t("clients.columns.createdAt"),
    },
    {
      accessorKey: "status.name",
      header: t("clients.columns.status"),
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/clients/${row.row.original.id}`}>
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
        <ClientHeader types={types} status={status} sources={sources} genders={genders} />
        <Link href="/clients/add">
          <Button className="cursor-pointer p-6 rounded-4xl flex gap-1 hover:bg-amber-200 hover:text-black hover:border-gray-600 border-1">
            <Plus />
            {t("clients.form.buttonText")}
          </Button>
        </Link>
      </div>
      <div>
        <DataTable data={data} columns={columns} />
      </div>
    </div>
  );
}

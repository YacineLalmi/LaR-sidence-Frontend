"use client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { User } from "@/schemas/user.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BienTypeFilter from "./BienFilter";
import BienTypeDelete from "./BienDelete";
import { useTranslations } from "next-intl";

interface Props {
  data: any;
}

export default function BienTable({ data }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<User | null>(null);
  const t = useTranslations("biens");

  const handleDelete = useCallback((item: User) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  }, []);

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
      accessorKey: "title",
      header: "Titre",
    },
    {
      accessorKey: "wilaya",
      header: "Wilaya",
    },
    {
      accessorKey: "commune",
      header: "Commune",
    },
    {
      accessorKey: "address",
      header: "Addresse",
    },
    {
      accessorKey: "is_active",
      header: "Actif",
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
            onClick={() => handleDelete(row.row.original)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      header: "Actions",
    },
  ];
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader className="flex">
        <BienTypeFilter />
        <Link href="/biens/add">
          <Button className="cursor-pointer flex gap-1">
            <Plus />
            {t("create")}
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <DataTable data={data} columns={columns} />
      </CardContent>
      <BienTypeDelete open={isDeleteModalOpen} setOpen={setIsDeleteModalOpen} item={itemToDelete} />
    </Card>
  );
}

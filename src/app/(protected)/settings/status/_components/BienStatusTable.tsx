"use client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { BienStatus } from "@/schemas/BienStatus.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BienStatusFilter from "./BienStatusFilter";
import BienStatusDelete from "./BienStatusDelete";

interface Props {
  data: any;
}

export default function BienStatusTable({ data }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<BienStatus | null>(null);

  const handleDelete = useCallback((item: BienStatus) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  }, []);

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
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: "ID",
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "Nom",
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
          <Link href={`/settings/status/${row.row.original.id}`}>
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
      <CardHeader className="flex items-center">
        <BienStatusFilter />
        <Link href="/settings/status/add">
          <Button className="cursor-pointer">Ajouter un Status</Button>
        </Link>
      </CardHeader>
      <CardContent>
        <DataTable data={data} columns={columns} />
      </CardContent>
      <BienStatusDelete open={isDeleteModalOpen} setOpen={setIsDeleteModalOpen} item={itemToDelete} />
    </Card>
  );
}

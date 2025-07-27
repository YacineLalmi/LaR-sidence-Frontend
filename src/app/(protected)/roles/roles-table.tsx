"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { MultiLang } from "@/schemas/global.schema";
import { Role } from "@/schemas/role.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Filter, Link, Search, Trash2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import RoleFilter from "./_components/role-filter";
import RoleDelete from "./_components/role-delete";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  data: any;
}

export default function RolesTable({ data }: Props) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [itemToDelete, setItemToDelete] = useState<Role | null>(null);

  const handleDelete = useCallback((item: Role) => {
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  }, []);

  const columns: ColumnDef<Role>[] = [
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
      accessorKey: "name",
      header: "Code",
      enableHiding: false,
    },
    {
      accessorKey: "display_name",
      header: "Nom",
      cell: ({ row }) => {
        const displayName = row.getValue("display_name") as MultiLang;
        console.log(displayName.fr);
        return displayName.fr || "N/A";
      },
    },
    {
      accessorKey: "description",
      header: "Description",
      cell: ({ row }) => {
        const description = row.getValue("description") as MultiLang;
        console.log(description.fr);
        return description.fr || "N/A";
      },
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/roles/modifier/${row.row.original.id}`}>
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
    },
  ];
  return (
    <Card className="bg-transparent border-none shadow-none">
      <CardHeader>
        <RoleFilter />
      </CardHeader>
      <CardContent>
        <DataTable data={data} columns={columns} />
      </CardContent>

      {/* Modals */}
      <RoleDelete open={isDeleteModalOpen} setOpen={setIsDeleteModalOpen} item={itemToDelete} />
    </Card>
  );
}

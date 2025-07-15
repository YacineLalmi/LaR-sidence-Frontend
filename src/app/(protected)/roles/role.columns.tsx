"use client";

import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Role } from "@/schemas/role.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";

const handleDelete = (item: Role) => {
  const router = useRouter();
  router.push(`modifier/${item.id}`);
};

export const columns: ColumnDef<Role>[] = [
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
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    id: "actions",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Link href={`/roles/${row.row.original.id}`}>
          <Button
            variant="outline"
            size="sm"
            title="voir"
            className="h-8 w-8 p-0 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/roles/modifier/${row.row.original.id}`}>
          <Button
            variant="outline"
            size="sm"
            title="modifier"
            className="h-8 w-8 p-0 bg-blue-50 text-blue-600 border-blue-200 hover:bg-blue-100 hover:text-blue-700 cursor-pointer"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          title="supprimer"
          onClick={() => handleDelete(row.row.original)}
          className="h-8 w-8 p-0 bg-red-50 text-red-600 border-red-200 hover:bg-red-100 hover:text-red-700 cursor-pointer"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

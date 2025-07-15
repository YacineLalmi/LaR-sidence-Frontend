"use client";

import { Button } from "@/components/ui/button";
import { Eye, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Role } from "@/schemas/role.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { User } from "@/schemas/utilisateur.schema";

const handleDelete = (item: User) => {
  const router = useRouter();
  router.push(`modifier/${item.id}`);
};

export const columns: ColumnDef<User>[] = [
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
    accessorKey: "nom_utilisateur",
    header: "Nom utilisateur",
  },
  {
    accessorKey: "nom",
    header: "Nom",
  },
  {
    accessorKey: "prenom",
    header: "Prénom",
  },
  {
    accessorKey: "est_active",
    header: "Status",
  },
  {
    accessorKey: "created_at",
    header: "Crée le",
  },
  {
    id: "actions",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Link href={`/users/${row.row.original.id}`}>
          <Button
            variant="outline"
            size="sm"
            title="voir"
            className="h-8 w-8 p-0 bg-green-50 text-green-600 border-green-200 hover:bg-green-100 hover:text-green-700 cursor-pointer"
          >
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
        <Link href={`/users/modifier/${row.row.original.id}`}>
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

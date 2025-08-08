"use client";

import { Button } from "@/components/ui/button";
import { Edit, Eye, Trash2 } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Role } from "@/schemas/role.schema";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MultiLang } from "@/schemas/Global.schema";

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
    // cell: ({ row }) => {
    //   const displayName = row.getValue("display_name") as MultiLang;
    //   console.log(displayName.fr);
    //   return displayName.fr || "N/A";
    // },
  },
  {
    accessorKey: "description",
    header: "Description",
    // cell: ({ row }) => {
    //   const description = row.getValue("description") as MultiLang;
    //   console.log(description.fr);
    //   return description.fr || "N/A";
    // },
  },
  {
    id: "actions",
    cell: (row) => (
      <div className="flex items-center gap-2">
        <Link href={`/roles/${row.row.original.id}`}>
          <Button variant="ghost" size="sm" className="cursor-pointer" title="voir">
            <Eye className="h-4 w-4" />
          </Button>
        </Link>
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

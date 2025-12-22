"use client";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Bien } from "@/schemas/biens/bien.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, File, FileSearch, FileSearch2, Image, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import BienHeader from "./BienHeader";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";

interface Props {
  data: any;
}

export default function BienTable({ data }: Props) {
  const t = useTranslations("biens");

  const columns: ColumnDef<Bien>[] = [
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
      cell: ({ row }) => {
        const first_image = row.original.first_image;
        return (
          <div className="flex items-center gap-2">
            {typeof first_image === "object" && first_image !== null ? (
              <img
                src={`data:image/jpeg;base64,${first_image.blob}`}
                alt="Property"
                className="h-8 w-8 object-cover rounded"
              />
            ) : (
              <Image className="h-8 w-8" />
            )}
            <div>{row.getValue("title")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "bien_type.name",
      header: t("columns.bienType"),
      cell: ({ row }) => {
        return row.original.bien_type?.name || "N/A";
      },
    },
    {
      accessorKey: "transaction_type.name",
      header: t("columns.transactionType"),
    },
    {
      accessorKey: "price",
      header: t("columns.price"),
    },
    {
      accessorKey: "availability_date",
      header: t("columns.availabilityDate"),
      cell: ({ row }) => {
        const date = new Date(row.original.availability_date);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "adresse",
      header: t("columns.adresse"),
    },
    {
      accessorKey: "bien_status.name",
      header: t("columns.status"),
      cell: ({ row }) => {
        const statusColor = `#${row.original.bien_status?.color.code || "555"}`;
        return (
          <Badge style={{ backgroundColor: statusColor, color: "red" }}>
            {row.original.bien_status?.name || "N/A"}
          </Badge>
        );
      },
    },
    {
      id: "fiche",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="lg" className="cursor-pointer p-0" title="modifier">
            <FileSearch2 className="h-8 w-8" size={155} />
          </Button>
        </div>
      ),
      header: t("columns.fiche"),
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <Link href={`/biens/${row.row.original.id}`}>
            <Button variant="ghost" size="icon" className="cursor-pointer" title="modifier">
              <Edit className="h-8 w-8" />
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
            <Trash2 className="h-8 w-8" />
          </Button>
        </div>
      ),
      header: t("columns.actions"),
    },
  ];
  return (
    <div className="flex flex-col gap-5">
      <BienHeader />
      <DataTable data={data} columns={columns} rowClassName="leading-14" />
    </div>
  );
}

// BienTable.tsx
"use client";
import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Bien } from "@/schemas/biens/bien.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, FileSearch2, Image, Trash2 } from "lucide-react";
import Link from "next/link";
import React from "react";
import BienHeader from "./BienHeader";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { ImageFetcher } from "@/components/ui/image-fetcher";
import { StatusBadge } from "@/components/ui/status-badge";

interface Props {
  data: any;
}

export default function BienTable({ data }: Props) {
  const translation = useTranslations();

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
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.ID),
    },
    {
      accessorKey: "title",
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.TITLE),
      cell: ({ row }) => {
        const firstImageId = row.original.images?.[0]?.id;
        return (
          <div className="flex items-center gap-2">
            {firstImageId ? <ImageFetcher imageId={firstImageId} /> : <Image className="h-8 w-8 text-gray-400" />}
            <div>{row.getValue("title")}</div>
          </div>
        );
      },
    },
    {
      accessorKey: "bien_type.name",
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.BIEN_TYPE),
      cell: ({ row }) => {
        return row.original.bien_type?.name || "N/A";
      },
    },
    {
      accessorKey: "transaction_type.name",
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.TRANSACTION_TYPE),
    },
    {
      accessorKey: "price",
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.PRICE),
    },
    {
      accessorKey: "availability_date",
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.AVAILABILITY_DATE),
      cell: ({ row }) => {
        const date = new Date(row.original.availability_date);
        return date.toLocaleDateString();
      },
    },
    {
      accessorKey: "adresse",
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.ADRESSE),
    },
    {
      accessorKey: "bien_status.name",
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.BIEN_STATUS),
      cell: ({ row }) => {
        <StatusBadge
          bgColor={row.original.bien_status.color.background_color || "555"}
          textColor={row.original.bien_status.color.text_color || "555"}
          text={row.original.bien_status?.name || "N/A"}
        />;
      },
    },
    {
      id: "fiche",
      cell: (row) => (
        <div className="flex items-center gap-1">
          <CustomButton Icon={FileSearch2} size="icon" variant="ghost" className="!p-0" />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.FICHE),
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center">
          <Link href={`/biens/${row.row.original.id}`}>
            <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />
          </Link>
          <CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.BIENS.COLUMNS.ACTIONS),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <BienHeader />
      <DataTable data={data} columns={columns} rowClassName="leading-14" />
    </div>
  );
}

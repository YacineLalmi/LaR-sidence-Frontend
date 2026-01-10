"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import Link from "next/link";
import React from "react";
import { ResponseMetaData } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { Client } from "@/schemas/clients/client.schema";
import CustomButton from "@/components/ui/custom-button";
import DeleteClientDialog from "./delete-client-dialog";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { StatusBadge } from "@/components/ui/status-badge";
import ClientDocumentDialog from "./client-document-dialog";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

interface Props {
  data: {
    items: Client[];
    meta?: ResponseMetaData;
  };
}

export default function ClientTable({ data }: Props) {
  const translation = useTranslations();

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
      header: translation(TRANSLATIONS_KEYS.CLIENTS.COLUMNS.ID),
    },
    {
      accessorKey: "first_name",
      header: translation(TRANSLATIONS_KEYS.CLIENTS.COLUMNS.FIRST_NAME),
    },
    {
      accessorKey: "last_name",
      header: translation(TRANSLATIONS_KEYS.CLIENTS.COLUMNS.LAST_NAME),
    },
    {
      accessorKey: "civility",
      header: translation(TRANSLATIONS_KEYS.CLIENTS.COLUMNS.CIVILITY),
    },
    {
      accessorKey: "created_at",
      header: translation(TRANSLATIONS_KEYS.CLIENTS.COLUMNS.CREATED_AT),
    },
    {
      accessorKey: "status.name",
      header: translation(TRANSLATIONS_KEYS.CLIENTS.COLUMNS.STATUS),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "document",
      header: translation(TRANSLATIONS_KEYS.CLIENTS.COLUMNS.DOCUMENT),
      cell: ({ row }) => <ClientDocumentDialog client={row.original} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DeleteClientDialog client={row.original} />
          <Link href={NAVIGATION_KEYS.CLIENTS.EDIT(row.original.id)}>
            <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />
          </Link>
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.CLIENTS.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import Link from "next/link";
import { PaginatedResponse } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { Client } from "@/schemas/clients/client.schema";
import CustomButton from "@/components/ui/custom-button";
import DeleteClientDialog from "./delete-client-dialog";
import { StatusBadge } from "@/components/ui/status-badge";
import ClientDocumentDialog from "./client-document-dialog";
import { format } from "date-fns";
import ClientInteractionHistoryDialog from "./client-interaction-history-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";
import { deleteClientsAction } from "@/actions/clients/delete-clients.action";
import { formatId } from "@/lib/utils";

interface Props {
  data: PaginatedResponse<Client>;
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
      header: translation(TRANSLATIONS_KEYS_2.CLIENTS.COLUMNS.ID),
      cell: ({ row }) => formatId(row.original.id),
    },
    {
      accessorKey: "first_name",
      header: translation(TRANSLATIONS_KEYS_2.CLIENTS.COLUMNS.FIRST_NAME),
      cell: ({ row }) => (
        <span>{row.original.civility === "company" ? row.original.company_name : row.original.first_name}</span>
      ),
    },
    {
      accessorKey: "last_name",
      header: translation(TRANSLATIONS_KEYS_2.CLIENTS.COLUMNS.LAST_NAME),
      cell: ({ row }) => (
        <span>{row.original.civility === "company" ? row.original.trade_register : row.original.last_name}</span>
      ),
    },
    {
      accessorKey: "civility",
      header: translation(TRANSLATIONS_KEYS_2.CLIENTS.COLUMNS.CIVILITY),
    },
    {
      accessorKey: "created_at",
      header: translation(TRANSLATIONS_KEYS_2.CLIENTS.COLUMNS.CREATED_AT),
      cell: ({ row }) => format(new Date(row.original.created_at), "dd/MM/yyyy HH:mm"),
    },
    {
      accessorKey: "status",
      header: translation(TRANSLATIONS_KEYS_2.CLIENTS.COLUMNS.STATUS),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "document",
      header: translation(TRANSLATIONS_KEYS_2.CLIENTS.COLUMNS.DOCUMENT),
      cell: ({ row }) => <ClientDocumentDialog client={row.original} />,
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center">
          <DeleteClientDialog client={row.original} />
          <Link href={ROUTES.CLIENTS.EDIT(row.original.id)}>
            <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0 size-7" />
          </Link>
          <ClientInteractionHistoryDialog interactions={row.original.interactions} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS_2.CLIENTS.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} onDeleteMultiple={deleteClientsAction} />;
}

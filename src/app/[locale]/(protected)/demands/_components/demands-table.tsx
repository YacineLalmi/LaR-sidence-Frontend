"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Demand } from "@/schemas/demands/demand.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PaginatedResponse } from "@/lib/definitions";
import { useLocale, useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui/status-badge";
import DeleteDemandDialog from "./delete-demand-dialog";
import CustomButton from "@/components/ui/custom-button";
import DemandDocumentDialog from "./demand-document-dialog";
import { deleteDemandsAction } from "@/actions/demands/delete-demands.action";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  data: PaginatedResponse<Demand>;
}

export default function DemandsTable({ data }: Props) {
  const translation = useTranslations();
  const locale = useLocale() as "fr" | "en" | "ar";

  const formatBudget = (budget: number | string | null | undefined) => {
    if (!budget) return "-";
    const numBudget = typeof budget === "string" ? parseFloat(budget) : budget;
    return (
      new Intl.NumberFormat("fr-DZ", {
        style: "decimal",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(numBudget) + " Da"
    );
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const columns: ColumnDef<Demand>[] = [
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
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.DEMAND_ID),
      cell: ({ row }) => {
        const id = row.original.id;
        return id ? id.toString().padStart(6, "0") : "-";
      },
    },
    // {
    //   accessorKey: "title",
    //   header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.TITLE),
    // },
    {
      accessorKey: "type",
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.TYPE),
      cell: ({ row }) => {
        const type = row.original.type;
        return type?.name[locale] || "-";
      },
    },
    {
      accessorKey: "client",
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.CLIENT),
      cell: ({ row }) => {
        const client = row.original.client;
        if (!client) return "-";
        const firstName = client.first_name || "";
        const lastName = client.last_name || "";
        return `${firstName} ${lastName}`.trim() || "-";
      },
    },
    {
      accessorKey: "agent",
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.AGENT),
      cell: ({ row }) => {
        const agent = row.original.agent;
        if (!agent) return "-";
        const firstName = agent.first_name || "";
        const lastName = agent.last_name || "";
        return `${firstName} ${lastName}`.trim() || "-";
      },
    },
    {
      accessorKey: "budget",
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.BUDGET),
      cell: ({ row }) => formatBudget(row.original.budget),
    },
    {
      accessorKey: "created_at",
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.DATE_ADDED),
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: "status",
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.STATUS),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "fiche",
      cell: ({ row }) => <DemandDocumentDialog demand={row.original} />,
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.FICHE),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center">
          <Link href={`/demands/${row.original.id}`}>
            <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />
          </Link>
          <DeleteDemandDialog demand={row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS_2.DEMANDS.COLUMNS.ACTIONS),
    },
  ];

  return <DataTable data={data} columns={columns} onDeleteMultiple={deleteDemandsAction} />;
}

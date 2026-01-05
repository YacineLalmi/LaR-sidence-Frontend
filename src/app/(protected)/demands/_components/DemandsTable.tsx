"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Demand } from "@/schemas/demands/demand.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { ResponseMetaData } from "@/lib/definitions";
import { useTranslations } from "next-intl";
import { ListItem } from "@/schemas/Global.schema";
import DemandsHeader from "./DemandsHeader";
import DemandDelete from "./DemandDelete";
import { useRouter } from "next/navigation";

interface Props {
  data: {
    items: Demand[];
    meta?: ResponseMetaData;
  };
  types: ListItem[];
  status: ListItem[];
  priorities: ListItem[];
  sources: ListItem[];
  clients: ListItem[];
  biens: ListItem[];
  agents: ListItem[];
}

export default function DemandsTable({ data, types, status, priorities, sources, clients, biens, agents }: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [demandToDelete, setDemandToDelete] = useState<string | null>(null);

  const handleDelete = (id: string) => {
    setDemandToDelete(id);
    setDeleteDialogOpen(true);
  };

  const formatBudget = (budget: number | string | null | undefined) => {
    if (!budget) return "-";
    const numBudget = typeof budget === 'string' ? parseFloat(budget) : budget;
    return new Intl.NumberFormat('fr-DZ', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numBudget) + " Da";
  };

  const formatDate = (date: string | null | undefined) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("fr-FR");
  };

  const getStatusColor = (statusName: string | undefined) => {
    if (!statusName) return "bg-gray-500";
    const name = statusName.toLowerCase();
    if (name.includes("ouvert") || name.includes("open")) return "bg-green-500";
    if (name.includes("en cours") || name.includes("progress")) return "bg-yellow-500";
    if (name.includes("fermé") || name.includes("closed")) return "bg-red-500";
    return "bg-gray-500";
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
      header: t("demands.columns.demandId"),
      cell: ({ row }) => {
        const id = row.original.id;
        return id ? id.toString().padStart(6, '0') : "-";
      },
    },
    {
      accessorKey: "title",
      header: t("demands.columns.title"),
    },
    {
      accessorKey: "type",
      header: t("demands.columns.type"),
      cell: ({ row }) => {
        const type = row.original.type;
        return type?.name || "-";
      },
    },
    {
      accessorKey: "client",
      header: t("demands.columns.client"),
      cell: ({ row }) => {
        const client = row.original.client;
        if (!client) return "-";
        const firstName = client.first_name || "";
        const lastName = client.last_name || "";
        return `${firstName} ${lastName}`.trim() || "-";
      },
    },
    {
      accessorKey: "budget",
      header: t("demands.columns.budget"),
      cell: ({ row }) => formatBudget(row.original.budget),
    },
    {
      accessorKey: "created_at",
      header: t("demands.columns.dateAdded"),
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: "status",
      header: t("demands.columns.status"),
      cell: ({ row }) => {
        const status = row.original.status;
        if (!status) return "-";
        return (
          <span className={`px-2 py-1 rounded text-xs text-white ${getStatusColor(status.name)}`}>
            {status.name}
          </span>
        );
      },
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <Link href={`/demands/${row.row.original.id}`}>
            <Button variant="ghost" size="sm" className="cursor-pointer" title={t("demands.actions.view")}>
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
          <Link href={`/demands/${row.row.original.id}/edit`}>
            <Button variant="ghost" size="sm" className="cursor-pointer" title={t("demands.actions.edit")}>
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="cursor-pointer"
            title={t("demands.actions.delete")}
            onClick={() => handleDelete(row.row.original.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
      header: t("demands.columns.actions"),
    },
  ];

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <DemandsHeader types={types} status={status} priorities={priorities} sources={sources} clients={clients} biens={biens} agents={agents} />
        <Link href="/demands/add">
          <Button className="cursor-pointer p-6 rounded-4xl flex gap-1 hover:bg-amber-200 hover:text-black hover:border-gray-600 border-1">
            <Plus />
            {t("demands.form.buttonText")}
          </Button>
        </Link>
      </div>
      <div>
        <DataTable data={data} columns={columns} />
      </div>
      {selectedRows.length > 0 && (
        <div className="flex justify-end mt-4">
          <Button
            variant="destructive"
            onClick={() => {
              // Handle bulk delete
              alert(`Delete ${selectedRows.length} items`);
            }}
          >
            {t("demands.actions.deleteSelection")}
          </Button>
        </div>
      )}
      <DemandDelete
        isOpen={deleteDialogOpen}
        setIsOpen={setDeleteDialogOpen}
        demandId={demandToDelete || ""}
        onSuccess={() => {
          router.refresh();
        }}
      />
    </div>
  );
}


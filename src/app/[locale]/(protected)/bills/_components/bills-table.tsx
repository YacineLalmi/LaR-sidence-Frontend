"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Demand } from "@/schemas/demands/demand.schema";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye } from "lucide-react";
import Link from "next/link";
import { PaginatedResponse } from "@/lib/definitions";
import { useLocale, useTranslations } from "next-intl";
import { StatusBadge } from "@/components/ui/status-badge";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Bill } from "@/schemas/bills/bill.schema";
import DeleteBillDialog from "./delete-bill-dialog";
import { deleteBillsAction } from "@/actions/bills/delete-bills.action";
import { ROUTES } from "@/constants/routes";
import PaymentDialog from "./payment-dialog";
import PaymentHistoryDialog from "./payment-history-dialog";
import ViewBillDialog from "./bill-preview";

interface Props {
  data: PaginatedResponse<Bill>;
}

export default function BillsTable({ data }: Props) {
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

  const columns: ColumnDef<Bill>[] = [
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
      header: translation(TRANSLATIONS_KEYS_2.BILLS.COLUMNS.ID),
      cell: ({ row }) => {
        const id = row.original.id;
        return id ? id.toString().padStart(6, "0") : "-";
      },
    },
    {
      accessorKey: "created_at",
      header: translation(TRANSLATIONS_KEYS_2.BILLS.COLUMNS.CREATED_AT),
      cell: ({ row }) => formatDate(row.original.created_at),
    },
    {
      accessorKey: "due_date",
      header: translation(TRANSLATIONS_KEYS_2.BILLS.COLUMNS.DUE_DATE),
      cell: ({ row }) => formatDate(row.original.due_date),
    },
    {
      accessorKey: "client",
      header: translation(TRANSLATIONS_KEYS_2.BILLS.COLUMNS.CLIENT_ID),
      cell: ({ row }) => {
        const client = row.original.client;
        if (!client) return "-";
        const firstName = client.first_name || "";
        const lastName = client.last_name || "";
        return `${firstName} ${lastName}`.trim() || "-";
      },
    },
    {
      accessorKey: "bien",
      header: translation(TRANSLATIONS_KEYS_2.BILLS.COLUMNS.BIEN_ID),
      cell: ({ row }) => {
        const bien = row.original.bien;
        if (!bien) return "-";
        return bien.id?.toString().padStart(6, "0") || "-";
      },
    },
    {
      accessorKey: "status",
      header: translation(TRANSLATIONS_KEYS_2.BILLS.COLUMNS.STATUS),
      cell: ({ row }) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: translation(TRANSLATIONS_KEYS_2.BILLS.COLUMNS.ACTIONS),
      cell: ({ row }) => {
        const bill = row.original;

        return (
          <div className="flex items-center gap-0">
            {/* View / Print Action */}
            <ViewBillDialog bill={row.original} />

            {/* Payment Action */}
            <PaymentDialog bill={bill} />

            {/* Payment History - New Action */}
            <PaymentHistoryDialog bill={bill} />

            {/* Existing Actions */}
            <Link href={ROUTES.BILLS.EDIT(bill.id)}>
              <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />
            </Link>
            <DeleteBillDialog bill={bill} />
          </div>
        );
      },
    },
  ];

  return <DataTable data={data} columns={columns} onDeleteMultiple={deleteBillsAction} />;
}

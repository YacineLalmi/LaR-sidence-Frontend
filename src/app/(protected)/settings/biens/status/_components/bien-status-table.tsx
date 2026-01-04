"use client";

import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { ResponseMetaData } from "@/lib/definitions";
import { BienStatus } from "@/schemas/bien-status/bien-status.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import CustomButton from "@/components/ui/custom-button";
import UpdateBienStatusDialog from "./update-bien-status-dialog";
import { ListItem } from "@/schemas/Global.schema";
import { useRouter } from "next/navigation";
import { customToast } from "@/lib/utils";
import { deleteBienStatusAction } from "@/actions/bien-status/delete.action";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import DeleteBienStatusDialog from "./delete-bien-status-dialog";

interface Props {
  colors: ListItem[];
  data: {
    items: BienStatus[];
    meta?: ResponseMetaData;
  };
}

export default function BienStatusTable({ data, colors }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  async function onConfirm(id: number) {
    setIsPending(true);
    try {
      const response = await deleteBienStatusAction(id);
      setIsPending(false);
      if (response.isOk) {
        setIsDeleteOpen(false);
        router.refresh();
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    }
  }

  const columns: ColumnDef<BienStatus>[] = [
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
    },
    {
      accessorKey: "id",
      header: () => {
        return (
          <SortingButton columnName={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.COLUMNS.ID)} columnKey="id" />
        );
      },
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.COLUMNS.CODE),
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.COLUMNS.NAME),
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.COLUMNS.DESCRIPTION),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.COLUMNS.CREATED_AT)}
            columnKey="created_at"
          />
        );
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "P");
      },
    },
    {
      id: "actions",
      cell: (row) => (
        <div className="flex items-center gap-2">
          <DeleteBienStatusDialog bienStatus={row.row.original} />
          <UpdateBienStatusDialog bienStatus={row.row.original} colors={colors} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

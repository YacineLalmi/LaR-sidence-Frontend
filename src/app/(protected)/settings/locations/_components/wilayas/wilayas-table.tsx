"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import UpdateWilayaDialog from "./update-wilaya-dialog";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";
import { PaginatedResponse } from "@/lib/definitions";
import DeleteWilayaDialog from "./delete-wilaya-dialog";
import { deleteWilayasAction } from "@/actions/wilayas/delete-wilayas.action";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  data: PaginatedResponse<Wilaya>;
}

export default function WilayasTable({ data }: Props) {
  const translation = useTranslations();
  const local = useLocale();

  const columns: ColumnDef<Wilaya>[] = [
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
      accessorKey: `name.${local}`,
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.COLUMNS.NAME),
    },
    {
      accessorKey: "code",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.COLUMNS.CODE),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DeleteWilayaDialog wilaya={row.original} />
          <UpdateWilayaDialog wilaya={row.original} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.COLUMNS.ACTIONS),
    },
  ];
  return (
    <DataTable
      data={data}
      columns={columns}
      onDeleteMultiple={deleteWilayasAction}
      cellClassName="!p-0"
      paginationConfig={{ prefix: "wilayas", visiblePages: 3 }}
    />
  );
}

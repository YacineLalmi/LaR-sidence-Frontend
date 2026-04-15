"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { PaginatedResponse, ResponseMetaData } from "@/lib/definitions";
import { Commune } from "@/schemas/communes/commune.schema";
import EditCommuneDialog from "./update-commune-dialog";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import DeleteCommuneDialog from "./delete-commune-dialog";
import { deleteCommunesAction } from "@/actions/commune/delete-communes.action";

interface Props {
  wilayas: ListItem[];
  data: PaginatedResponse<Commune>;
}

export default function CommuneTable({ data, wilayas }: Props) {
  const translation = useTranslations();
  const local = useLocale();

  const columns: ColumnDef<Commune>[] = [
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
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.COLUMNS.NAME),
    },
    {
      accessorKey: "post_code",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.COLUMNS.POST_CODE),
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <DeleteCommuneDialog commune={row.original} />
          <EditCommuneDialog commune={row.original} wilayas={wilayas} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.COLUMNS.ACTIONS),
    },
  ];
  return (
    <DataTable
      data={data}
      columns={columns}
      cellClassName="!p-0"
      paginationConfig={{ prefix: "communes", visiblePages: 3 }}
      onDeleteMultiple={deleteCommunesAction}
    />
  );
}

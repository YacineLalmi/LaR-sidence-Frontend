"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { PaginatedResponse } from "@/lib/definitions";
import { Color } from "@/schemas/colors/color.schema";
import UpdateColorDialog from "./update-color-dialog";
import DeleteColorDialog from "./delete-color-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Badge } from "@/components/ui/badge";
import { formatId } from "@/lib/utils";
import { deleteColorsAction } from "@/actions/colors/delete-colors.action";

interface Props {
  data: PaginatedResponse<Color>;
}

export default function ColorTable({ data }: Props) {
  const translation = useTranslations();
  const locale = useLocale() as "fr" | "en" | "ar";

  const columns: ColumnDef<Color>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px]"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px]"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: () => (
        <SortingButton columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.ID)} columnKey="id" />
      ),
      cell: ({ row }) => {
        // On transforme l'ID en string et on complète avec des '0' jusqu'à 6 caractères
        const formattedId = formatId(row.getValue("id"));

        return <span className="text-base font-semibold">{formattedId}</span>;
      },
    },
    {
      accessorKey: "name",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.NAME),
      cell: ({ row }) => <span className="font-medium">{row.original.name[locale]}</span>,
    },
    {
      accessorKey: "background_color",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.BACKGROUND_COLOR),
      cell: ({ row }) => {
        const color = row.original.background_color;
        return (
          <div className="flex items-center gap-2">
            {/* Petit cercle de preview */}
            <div className="h-6 w-6 rounded-full border border-border shadow-sm" style={{ backgroundColor: color }} />
            <code className="uppercase">{color}</code>
          </div>
        );
      },
    },
    {
      accessorKey: "text_color",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.TEXT_COLOR),
      cell: ({ row }) => {
        const color = row.original.text_color;
        return (
          <div className="flex items-center gap-2">
            {/* Petit cercle de preview */}
            <div className="h-6 w-6 rounded-full border border-border shadow-sm" style={{ backgroundColor: color }} />
            <code className="uppercase">{color}</code>
          </div>
        );
      },
    },
    {
      accessorKey: "preview",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.PREVIEW),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          style={{
            backgroundColor: row.original.background_color,
            color: row.original.text_color,
            borderColor: "transparent",
          }}
          className="font-semibold shadow-sm"
        >
          Sample Text
        </Badge>
      ),
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.DESCRIPTION),
      cell: ({ row }) => (
        <div className="max-w-[200px] truncate text-sm">{row.original.description?.[locale] || "—"}</div>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => (
        <SortingButton
          columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.CREATED_AT)}
          columnKey="created_at"
        />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {format(new Date(row.getValue("created_at")), "dd/MM/yyyy HH:mm")}
        </span>
      ),
    },
    {
      id: "actions",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.ACTIONS),
      cell: ({ row }) => (
        <div className="flex items-center justify-start gap-2">
          <UpdateColorDialog color={row.original} />
          <DeleteColorDialog color={row.original} />
        </div>
      ),
    },
  ];

  return <DataTable data={data} columns={columns} onDeleteMultiple={deleteColorsAction} />;
}

"use client";

import { DataTable } from "@/components/data-table";
import { ColumnDef } from "@tanstack/react-table";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { useCallback } from "react";
import { ListItem } from "@/schemas/global.schema";
import { formatId } from "@/lib/utils";
import { User } from "@/schemas/users/user.schema";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaginatedResponse } from "@/lib/definitions";
import { updateUserColor } from "@/actions/users/update-user-color.action";
import { useRouter } from "next/navigation";

interface Props {
  data: PaginatedResponse<User>;
  colors: ListItem[];
}

export default function EventUserColorTable({ data, colors }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const locale = useLocale() as "fr" | "en" | "ar";

  const handleColorChange = useCallback(async (value: any, user: User) => {
    try {
      const response = await updateUserColor({ color_id: value }, user.id);
      if (response.isOk) {
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    }
  }, []);

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "id",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.COLUMNS.ID)}
            columnKey="id"
          />
        );
      },
      cell: ({ row }) => formatId(row.original.id),
    },
    {
      accessorKey: "first_name",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.NAME),
    },
    {
      accessorKey: "last_name",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.NAME),
    },
    {
      accessorKey: "username",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.EMAIL),
    },
    {
      accessorKey: "preview",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.COLUMNS.PREVIEW),
      cell: ({ row }) => (
        <Badge
          variant="outline"
          style={{
            backgroundColor: row.original.color?.background_color,
            color: row.original.color?.text_color,
            borderColor: "transparent",
          }}
          className="font-semibold shadow-sm"
        >
          Sample Text
        </Badge>
      ),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.COLUMNS.CREATED_AT)}
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
      cell: ({ row }) => (
        <Select onValueChange={(color_id) => handleColorChange(color_id, row.original)} value={row.original.color?.id}>
          <SelectTrigger className="w-full max-w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Couleurs</SelectLabel>
              {colors.map((color) => (
                <SelectItem key={color.id} value={color.id}>
                  {color.name}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      ),
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.EVENTS.TYPES.COLUMNS.ACTIONS),
    },
  ];
  return <DataTable data={data} columns={columns} />;
}

"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import React, { useCallback, useState } from "react";
import SortingButton from "@/components/ui/sorting-button";
import { format } from "date-fns";
import { Role } from "@/schemas/roles/role.schema";
import UpdateRoleDialog from "./update-role-dialog";
import { PermissionCategory } from "@/schemas/permissions/permission-category.schema";
import DeleteRoleDialog from "./delete-role-dialog";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  data: any;
  permissions: PermissionCategory[];
}

export default function RolesTable({ data, permissions }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<Role>[] = [
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
      header: () => {
        return <SortingButton columnName={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.COLUMNS.ID)} columnKey="id" />;
      },
    },
    {
      accessorKey: "display_name",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.COLUMNS.NAME),
      enableHiding: false,
    },
    {
      accessorKey: "description",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.COLUMNS.DESCRIPTION),
    },
    {
      accessorKey: "permissions",
      header: translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.COLUMNS.PERMISSIONS),
      cell: ({ row }) => {
        const permissions = row.original.permissions || [];
        const displayLimit = 5;
        const hasMore = permissions.length > displayLimit;
        const displayPermissions = permissions.slice(0, displayLimit);

        if (permissions.length === 0) {
          return <span className="text-gray-400 text-sm">Aucune permission</span>;
        }

        return (
          <div className="flex flex-wrap gap-1 max-w-md">
            {displayPermissions.map((permission: any) => (
              <span
                key={permission.id}
                className="inline-flex items-center px-2 py-1 rounded-md bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {permission.display_name}
              </span>
            ))}
            {hasMore && (
              <span className="inline-flex items-center px-2 py-1 rounded-md bg-gray-200 text-gray-600 text-xs font-medium">
                +{permissions.length - displayLimit} ...
              </span>
            )}
          </div>
        );
      },
    },

    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.COLUMNS.CREATED_AT)}
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
        <div className="flex items-center gap-2">
          <DeleteRoleDialog role={row.original} />
          <UpdateRoleDialog role={row.original} permissions={permissions} />
        </div>
      ),
      header: translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.COLUMNS.ACTIONS),
    },
  ];

  return <DataTable data={data} columns={columns} />;
}

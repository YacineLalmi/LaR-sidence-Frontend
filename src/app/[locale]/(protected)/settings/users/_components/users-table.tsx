"use client";

import { DataTable } from "@/components/data-table";
import { Checkbox } from "@/components/ui/checkbox";
import { ColumnDef } from "@tanstack/react-table";
import { Edit } from "lucide-react";
import { Link } from "@/i18n/navigation";
import Status from "@/components/ui/status";
import { useTranslations } from "next-intl";
import { User } from "@/schemas/users/user.schema";
import { format } from "date-fns";
import SortingButton from "@/components/ui/sorting-button";
import CustomButton from "@/components/ui/custom-button";
import DeleteUserDialog from "./delete-user-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";
import { deleteUsersAction } from "@/actions/users/delete-users.action";

interface Props {
  data: any;
}

export default function UsersTable({ data }: Props) {
  const translation = useTranslations();

  const columns: ColumnDef<User>[] = [
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
        return <SortingButton columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.ID)} columnKey="id" />;
      },
    },
    {
      id: "fullName",
      cell: ({ row }) => <span>{row.original.first_name + " " + row.original.last_name}</span>,
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.NAME),
    },
    {
      accessorKey: "phonenumber",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.PHONE_NUMBER),
    },
    {
      accessorKey: "email",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.EMAIL),
    },
    {
      accessorKey: "created_at",
      header: () => {
        return (
          <SortingButton
            columnName={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.CREATED_AT)}
            columnKey="created_at"
          />
        );
      },
      cell: ({ row }) => {
        return format(new Date(row.getValue("created_at")), "P");
      },
    },
    {
      accessorKey: "role.name",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.ROLE),
    },
    {
      accessorKey: "is_active",
      header: translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.COLUMNS.STATUS),
      cell: ({ row }) => {
        return row.getValue("is_active") ? <Status value="Active" /> : <Status value="Inactive" color="bg-red-500" />;
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex items-center">
          <DeleteUserDialog user={row.original} />
          <Link href={ROUTES.SETTINGS.USERS.EDIT(row.original.id)}>
            <CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />
          </Link>
        </div>
      ),
      header: "Actions",
    },
  ];
  return <DataTable data={data} columns={columns} onDeleteMultiple={deleteUsersAction} />;
}

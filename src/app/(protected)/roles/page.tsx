import { DataTable } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { columns } from "./role.columns";
import { RoleService } from "@/services/role.service";
import { createRoleAction } from "@/app/(protected)/roles/_actions/create.action";
import useViewModel from "./view-model";
import { CreateRoleInputs } from "@/schemas/role.schema";
import { UserService } from "@/services/utilisateur.service";

export default async function Roles({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const { createRoleInitialState } = useViewModel();

  const data = await RoleService.findAll({ page, perPage, query });
  return (
    <Card>
      <CardContent>
        <DataTable
          data={data}
          columns={columns}
          actions={{
            create: createRoleAction,
            update: createRoleAction,
            delete: createRoleAction,
          }}
          initialStale={createRoleInitialState}
          createButtonText="Add Role"
          currentPath="/roles"
        />
      </CardContent>
    </Card>
  );
}

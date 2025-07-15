import { DataTable } from "@/components/data-table";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { createRoleAction } from "@/app/(protected)/roles/_actions/create.action";
import useViewModel from "./view-model";
import { columns } from "./user.columns";
import { UserService } from "@/services/utilisateur.service";

export default async function page({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const { userInitialState } = useViewModel();

  const data = await UserService.findAll({ page, perPage, query });

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
          initialStale={userInitialState}
          createButtonText="Add Utilisateur"
          currentPath="/utilisateurs"
        />
      </CardContent>
    </Card>
  );
}

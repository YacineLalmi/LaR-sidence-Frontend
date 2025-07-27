import { DataTable } from "@/components/data-table";
import React from "react";
import { columns } from "@/components/data-table/columns/role.columns";
import { RoleService } from "@/services/role.service";
import { createRoleAction } from "@/actions/roles/create.action";
import useViewModel from "./view-model";
import RolesTable from "./roles-table";

export default async function Roles({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const data = await RoleService.findAll({ page, perPage, query });
  return <RolesTable data={data} />;
}

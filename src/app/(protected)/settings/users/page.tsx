import React from "react";
import { UserService } from "@/services/users.service";
import UsersTable from "./_components/UsersTable";
import SettingsView from "@/views/settings.view";
import UsersFilters from "./_components/UsersFilters";

export default async function Utilisateurs({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await UserService.findAll(queryParams);
  return <SettingsView module="users" filters={<UsersFilters />} table={<UsersTable data={data} />} />;
}

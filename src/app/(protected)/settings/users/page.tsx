import React from "react";
import { UserService } from "@/services/users.service";
import UtilisateursTable from "./utilisateurs-table";

export default async function Utilisateurs({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const page = (await searchParams).page ?? "1";
  const perPage = (await searchParams).perPage ?? "10";
  const query = (await searchParams).query ?? "";

  const data = await UserService.findAll({ page, perPage, query });
  return <UtilisateursTable data={data} />;
}

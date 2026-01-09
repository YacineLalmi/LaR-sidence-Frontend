import SearchField from "@/components/ui/search";
import React from "react";
import UsersFilters from "./users-filter";
import { RoleService } from "@/services/role.service";

export default async function UsersHeader() {
  const roles = await RoleService.list();
  return (
    <div className="flex w-full gap-2">
      <SearchField />
      <UsersFilters roles={roles} />
    </div>
  );
}

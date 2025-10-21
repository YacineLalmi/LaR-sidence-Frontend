import React from "react";
import CreateRoleForm from "./create-role";
import { PermissionService } from "@/services/permission.service";

export default async function page() {
  const permissions = await PermissionService.findAll();
  return <CreateRoleForm permissionCategories={permissions} />;
}

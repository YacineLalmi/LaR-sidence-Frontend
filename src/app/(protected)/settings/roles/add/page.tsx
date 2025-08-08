import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import React from "react";
import AddRoleForm from "./add-form";
import { PermissionService } from "@/services/permission.service";

export default async function page() {
  const permissions = await PermissionService.findAll();
  return <AddRoleForm permissions={permissions.items} formId="add-role" />;
}

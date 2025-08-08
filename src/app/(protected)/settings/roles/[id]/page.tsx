import { RoleService } from "@/services/role.service";
import React from "react";
import UpdateRoleForm from "./update-form";
import { PermissionService } from "@/services/permission.service";
import { Card, CardHeader } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";

export default async function page({ params }: { params: Promise<{ id: string }> }) {
  const id = parseInt((await params).id);
  const role = await RoleService.findOne(id);
  const permissions = await PermissionService.findAll();
  const t = await getTranslations("roles");

  return (
    <Card>
      <CardHeader>{t("edit")}</CardHeader>
      <UpdateRoleForm role={role} formId="update-role" permissions={permissions.items} />
    </Card>
  );
}

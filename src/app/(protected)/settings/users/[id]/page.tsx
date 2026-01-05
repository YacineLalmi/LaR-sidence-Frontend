import { UserService } from "@/services/user.service";
import React from "react";
import UpdateUserForm from "./update-form";
import { RoleService } from "@/services/role.service";

export default async function UtilisateurDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const user = await UserService.findOne(id);
  const roles = await RoleService.list();

  return <UpdateUserForm user={user} roles={roles} />;
}

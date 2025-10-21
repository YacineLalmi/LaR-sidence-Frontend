import { UserService } from "@/services/users.service";
import React from "react";
import UpdateUserForm from "./update-form";
import { RoleService } from "@/services/role.service";

export default async function UtilisateurDetailPage({ params }: { params: { id: string } }) {
  const id = params.id as string;
  const user = await UserService.findOne(id);
  const roles = await RoleService.list();

  return <UpdateUserForm user={user} roles={roles} />;
}

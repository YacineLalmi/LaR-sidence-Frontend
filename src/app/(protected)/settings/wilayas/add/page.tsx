import { RoleService } from "@/services/role.service";
import CreateUserForm from "./create-user";

export default async function AjouterUtilisateurPage() {
  const data = await RoleService.list();
  return <CreateUserForm roles={data} />;
}

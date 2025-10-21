import { RoleService } from "@/services/role.service";
import SettingsView from "@/views/settings.view";
import RolesTable from "./_components/roles-table";

export default async function Roles({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await RoleService.findAll(queryParams);
  return <SettingsView module="roles" table={<RolesTable data={data} />} />;
}

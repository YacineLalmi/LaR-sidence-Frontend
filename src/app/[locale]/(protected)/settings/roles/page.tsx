import { RoleService } from "@/services/role.service";
import RolesTable from "./_components/roles-table";
import SearchField from "@/components/ui/search";
import CreateRoleDialog from "./_components/create-role-dialog";
import { PermissionService } from "@/services/permission.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Role } from "@/schemas/roles/role.schema";
import { ROUTES } from "@/constants/routes";
import { PermissionCategory } from "@/schemas/permissions/permission-category.schema";

export default async function Roles({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  let result: PaginatedResponse<Role> = { data: [], meta: undefined };
  let permissions: PermissionCategory[] = [];
  let responseError: Error | null = null;

  try {
    result = await RoleService.findMany({ ...queryParams, include: "permissions" });
    permissions = await PermissionService.findAll();
  } catch (error: any) {
    responseError = error;
  }

  return (
    <SettingsView
      searchField={<SearchField />}
      createComponent={<CreateRoleDialog permissions={permissions} />}
      error={responseError}
      backLink={ROUTES.SETTINGS.ROOT}
    >
      <RolesTable data={result} permissions={permissions} />
    </SettingsView>
  );
}

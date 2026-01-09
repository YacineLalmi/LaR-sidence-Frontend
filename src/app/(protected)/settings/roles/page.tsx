import { RoleService } from "@/services/role.service";
import RolesTable from "./_components/roles-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import SearchField from "@/components/ui/search";
import CreateRoleDialog from "./_components/create-role-dialog";
import { PermissionService } from "@/services/permission.service";

export default async function Roles({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const roles = await RoleService.findAll(queryParams);
  const permissions = await PermissionService.findAll();
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.ROLES.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.ROOT}
        />
        <div className="flex w-full justify-between gap-2">
          <SearchField />
          <CreateRoleDialog permissions={permissions} />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <RolesTable data={roles} permissions={permissions} />
      </CardContent>
    </Card>
  );
}

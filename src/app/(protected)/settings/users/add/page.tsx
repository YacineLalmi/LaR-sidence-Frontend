import { RoleService } from "@/services/role.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import CreateUserForm from "./_components/create-user-form";

export default async function AjouterUtilisateurPage() {
  const translation = await getTranslations();
  const roles = await RoleService.list();
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.CREATE_USER)}
          backLink={NAVIGATION_KEYS.SETTINGS.ROOT}
        />
        {/* <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}</h1> */}
      </CardHeader>
      <CardContent className="px-0">
        <CreateUserForm roles={roles} />
      </CardContent>
    </Card>
  );
}

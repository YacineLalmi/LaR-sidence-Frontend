import { RoleService } from "@/services/role.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import CreateUserForm from "./_components/create-user-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function AjouterUtilisateurPage() {
  const translation = await getTranslations();
  const roles = await RoleService.list();
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.TITLES.CREATE)}
          backLink={ROUTES.SETTINGS.USERS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateUserForm roles={roles} />
      </CardContent>
    </Card>
  );
}

import { UserService } from "@/services/user.service";
import { RoleService } from "@/services/role.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import UpdateUserForm from "./_components/update-user-form";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function UtilisateurDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const translation = await getTranslations();
  const id = (await params).id;
  const user = await UserService.findOne(id);
  const roles = await RoleService.list();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.TITLES.UPDATE)}
          backLink={ROUTES.SETTINGS.USERS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpdateUserForm user={user} roles={roles} />
      </CardContent>
    </Card>
  );
}

import { UserService } from "@/services/user.service";
import React from "react";
import { RoleService } from "@/services/role.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import UpdateUserForm from "./_components/update-user-form";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { getTranslations } from "next-intl/server";

export default async function UtilisateurDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const translation = await getTranslations();
  const id = (await params).id;
  const user = await UserService.findOne(id);
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
        <UpdateUserForm user={user} roles={roles} />
      </CardContent>
    </Card>
  );
}

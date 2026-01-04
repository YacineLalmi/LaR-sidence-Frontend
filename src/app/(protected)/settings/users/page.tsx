import React from "react";
import { UserService } from "@/services/users.service";
import UsersTable from "./_components/UsersTable";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import SearchField from "@/components/ui/search";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

export default async function Utilisateurs({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const data = await UserService.findAll(queryParams);
  return (
    <Card className="bg-transparent border-none shadow-none px-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.BIENS.ROOT}
        />
        {/* <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}</h1> */}
        <div className="flex w-full justify-between gap-2">
          <SearchField />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <UsersTable data={data} />
      </CardContent>
    </Card>
  );
}

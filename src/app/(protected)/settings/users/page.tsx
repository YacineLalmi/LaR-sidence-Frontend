import React from "react";
import { UserService } from "@/services/user.service";
import UsersTable from "./_components/users-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import CustomButton from "@/components/ui/custom-button";
import { Plus } from "lucide-react";
import Link from "next/link";
import UsersHeader from "./_components/users-header";

export default async function Utilisateurs({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const data = await UserService.findAll(queryParams);
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.ROOT}
        />
        <div className="flex w-full justify-between gap-2">
          <UsersHeader />
          <Link href="/settings/users/add">
            <CustomButton text={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.CREATE_USER)} Icon={Plus} />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <UsersTable data={data} />
      </CardContent>
    </Card>
  );
}

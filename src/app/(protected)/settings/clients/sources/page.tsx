import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import SearchField from "@/components/ui/search";
import NavigationButton from "@/components/ui/navigation-button";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import CreateClientSourceDialog from "./_components/create-client-source-dialog";
import ClientSourceTable from "./_components/client-source-table";
import { ClientSourceService } from "@/services/client-source.service";

export default async function ClientType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const data = await ClientSourceService.findAll(queryParams);
  return (
    <Card className="bg-transparent border-none shadow-none px-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.TITLE)}
          backLink={NAVIGATION_KEYS.SETTINGS.CLIENTS.ROOT}
        />
        {/* <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.TYPES.TITLE)}</h1> */}
        <div className="flex w-full justify-between gap-2">
          <SearchField />
          <CreateClientSourceDialog />
        </div>
      </CardHeader>
      <CardContent className="px-0">
        <ClientSourceTable data={data} />
      </CardContent>
    </Card>
  );
}

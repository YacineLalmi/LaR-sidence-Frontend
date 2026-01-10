import React from "react";
import CreateClientForm from "./_components/create-client-form";
import { ClientStatusService } from "@/services/client-status.service";
import { ClientTypeService } from "@/services/client-types.service";
import { ClientSourceService } from "@/services/client-source.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { getTranslations } from "next-intl/server";

export default async function ClientAdd() {
  const translation = await getTranslations();
  const clientTypes = await ClientTypeService.list();
  const clientStatus = await ClientStatusService.list();
  const clientSources = await ClientSourceService.list();
  const civilities = [
    {
      id: "F",
      name: "Female",
    },
    {
      id: "M",
      name: "Male",
    },
    {
      id: "C",
      name: "Company",
    },
  ];

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.ADD_CLIENT)}
          backLink={NAVIGATION_KEYS.CLIENTS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateClientForm types={clientTypes} status={clientStatus} sources={clientSources} civilities={civilities} />;
      </CardContent>
    </Card>
  );
}

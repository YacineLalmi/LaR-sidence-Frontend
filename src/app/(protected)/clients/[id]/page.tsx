import { ClientService } from "@/services/client.service";
import React from "react";
import UpdateClientForm from "./_components/update-client-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { getTranslations } from "next-intl/server";

export default async function UpdateForm({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const translation = await getTranslations();
  const clientTypes = await ClientService.typesList();
  const clientStatus = await ClientService.statusList();
  const clientSources = await ClientService.sourcesList();
  const client = await ClientService.findOne(id);
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
          title={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.EDIT_CLIENT)}
          backLink={NAVIGATION_KEYS.CLIENTS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpdateClientForm
          types={clientTypes}
          status={clientStatus}
          sources={clientSources}
          civilities={civilities}
          client={client}
        />
      </CardContent>
    </Card>
  );
}

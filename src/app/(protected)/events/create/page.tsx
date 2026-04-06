import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import CreateEventForm from "./_components/create-event-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { UserService } from "@/services/user.service";
import { BienService } from "@/services/bien.service";
import { ClientService } from "@/services/client.service";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { ROUTES } from "@/constants/routes";

export default async function EventAdd() {
  const translation = await getTranslations();

  const eventTypes = await ClassificationService(CATEGORIES.TYPE, SCOPES.EVENT).list();
  const agents = await UserService.agentList();
  const biens = await BienService.list();
  const clients = await ClientService.list();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.EVENTS.ACTIONS.ADD_EVENT)}
          backLink={ROUTES.EVENTS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateEventForm eventTypes={eventTypes} agents={agents} biens={biens} clients={clients} />
      </CardContent>
    </Card>
  );
}

import React from "react";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { getTranslations } from "next-intl/server";
import CreateEventForm from "./_components/create-event-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { EventTypeService } from "@/services/event-types.service";
import { UserService } from "@/services/user.service";
import { BienService } from "@/services/bien.service";
import { ClientService } from "@/services/client.service";

export default async function EventAdd() {
  const translation = await getTranslations();

  const eventTypes = await EventTypeService.list();
  const agents = await UserService.agentList();
  const biens = await BienService.list();
  const clients = await ClientService.list();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.CALENDAR.ACTIONS.ADDEVENT)}
          backLink={NAVIGATION_KEYS.CLIENTS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateEventForm eventTypes={eventTypes} agents={agents} biens={biens} clients={clients} />
      </CardContent>
    </Card>
  );
}

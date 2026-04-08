import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import UpdateEventForm from "./_components/update-event-form";
import { EventService } from "@/services/event.service";
import { ROUTES } from "@/constants/routes";

export default async function UpdateEvent({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const translation = await getTranslations();

  const event = await EventService.findOne(id);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.EVENTS.ACTIONS.ADD_EVENT)}
          backLink={ROUTES.EVENTS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpdateEventForm event={event} />
      </CardContent>
    </Card>
  );
}

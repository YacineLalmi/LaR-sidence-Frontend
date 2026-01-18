import React from "react";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import EventsCalendarView from "./_components/events-calender-view";
import EventHeader from "./_components/events-header";

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const params = await searchParams;
  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS_2.CALENDAR.TITLE)}</h1>
        <EventHeader />
      </CardHeader>
      <CardContent className="px-0">
        <EventsCalendarView searchParams={params} />
      </CardContent>
    </Card>
  );
}

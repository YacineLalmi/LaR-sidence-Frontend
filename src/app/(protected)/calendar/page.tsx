import React from "react";
import { EventsService } from "@/services/events.service";
import { getTranslations } from "next-intl/server";
import CalendarView from "./_components/CalendarView";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const params = await searchParams;
  const currentDate = params.date ? new Date(params.date) : new Date();
  const view = (params.view as "month" | "week") ?? "month";

  const start = new Date(currentDate);
  const end = new Date(currentDate);

  if (view === "month") {
    start.setDate(1);
    end.setMonth(end.getMonth() + 1);
    end.setDate(0);
  } else {
    const day = start.getDay();
    const diff = (day + 6) % 7; // make Monday first day
    start.setDate(start.getDate() - diff);
    end.setDate(start.getDate() + 6);
  }

  const dateRange = `${start.toISOString()},${end.toISOString()}`;

  const events = await EventsService.findAll({
    "start_date_between": dateRange,
    perPage: "100",
  });

  const t = await getTranslations();

  return (
    <div className="flex flex-col gap-3">
      <div>
        <h1 className="text-2xl font-bold">{t("calendar.title")}</h1>
      </div>
      <CalendarView
        events={events.items}
        meta={events.meta}
        currentDate={currentDate}
        view={view}
      />
    </div>
  );
}





import React from "react";
import { EventService } from "@/services/event.service";
import EventCalenderMonth from "./events-calender-months";
import EventsCalenderWeeks from "./events-calender-weeks";
import EventsCalenderDays from "./events-calender-days";

export default async function EventsCalendarView({ searchParams }: { searchParams: { [key: string]: string } }) {
  const params = searchParams;

  const viewMode = (params.view as "month" | "week" | "day") ?? "month";
  const now: Date = new Date();
  const startDate =
    params.startDate || new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0, 0).toISOString();
  const endDate = params.endDate || new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();

  const events = await EventService.findAll({
    startDate,
    endDate,
  });

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="bg-transparent overflow-hidden">
        {viewMode === "month" && <EventCalenderMonth events={events.items} startDate={new Date(startDate)} />}
        {viewMode === "week" && <EventsCalenderWeeks events={events.items} startDate={new Date(startDate)} />}
        {viewMode === "day" && <EventsCalenderDays events={events.items} date={new Date(startDate)} />}
      </div>
    </div>
  );
}

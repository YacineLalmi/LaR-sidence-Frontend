"use client";

import React, { useMemo, useState } from "react";
import { Event } from "@/schemas/events/event.schema";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, isSameDay, isSameMonth } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";
import EventFormDialog from "./EventFormDialog";

interface CalendarViewProps {
  events: Event[];
  meta: any;
  currentDate: Date;
  view: "month" | "week";
}

export default function CalendarView({ events, meta, currentDate, view }: CalendarViewProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("calendar");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

  const handleNavigate = (direction: "prev" | "next") => {
    const date = new Date(currentDate);
    if (view === "month") {
      date.setMonth(date.getMonth() + (direction === "next" ? 1 : -1));
    } else {
      date.setDate(date.getDate() + (direction === "next" ? 7 : -7));
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set("date", date.toISOString());
    router.push(`?${params.toString()}`);
  };

  const handleViewChange = (nextView: "month" | "week") => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("view", nextView);
    router.push(`?${params.toString()}`);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleAddEventClick = () => {
    setSelectedDate(undefined);
    setDialogOpen(true);
  };

  const handleEventCreated = () => {
    // Refresh the page to show the new event
    router.refresh();
  };

  const weeks = useMemo(() => {
    const start = view === "month" ? startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }) : startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = view === "month" ? endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }) : endOfWeek(currentDate, { weekStartsOn: 1 });

    const day = start;
    const calendar: Date[][] = [];

    while (day <= end) {
      const week: Date[] = [];
      for (let i = 0; i < 7; i++) {
        week.push(new Date(day));
        day.setDate(day.getDate() + 1);
      }
      calendar.push(week);
    }

    return calendar;
  }, [currentDate, view]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, Event[]>();
    events.forEach((event) => {
      const dateKey = format(event.start_date, "yyyy-MM-dd");
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    });
    return map;
  }, [events]);

  const dayNames = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Button
            variant={view === "month" ? "default" : "outline"}
            className="rounded-3xl px-4"
            onClick={() => handleViewChange("month")}
          >
            {t("view.month")}
          </Button>
          <Button
            variant={view === "week" ? "default" : "outline"}
            className="rounded-3xl px-4"
            onClick={() => handleViewChange("week")}
          >
            {t("view.week")}
          </Button>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-gray-400"
            onClick={() => handleNavigate("prev")}
          >
            <ChevronLeft />
          </Button>
          <span className="font-semibold text-lg">
            {format(
              currentDate,
              view === "month" ? "MMMM yyyy" : `'${t("week.prefix")}' dd MMMM yyyy`,
              { locale: fr }
            )}
          </span>
          <Button
            variant="outline"
            size="icon"
            className="rounded-full border-gray-400"
            onClick={() => handleNavigate("next")}
          >
            <ChevronRight />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button className="rounded-3xl px-4 flex gap-2 items-center" onClick={handleAddEventClick}>
            <Plus size={16} />
            {t("actions.addEvent")}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 bg-[#f4f2ec] p-4 rounded-3xl">
        {dayNames.map((day) => (
          <div key={day} className="text-center font-medium text-sm text-gray-600">
            {day}
          </div>
        ))}
        {weeks.map((week, wi) =>
          week.map((day, di) => {
            const key = format(day, "yyyy-MM-dd");
            const dayEvents = eventsByDay.get(key) ?? [];
            const isToday = isSameDay(day, new Date());
            const inCurrentMonth = isSameMonth(day, currentDate);

            return (
              <button
                key={`${wi}-${di}`}
                type="button"
                className={`min-h-[90px] rounded-2xl p-2 flex flex-col gap-1 border cursor-pointer hover:bg-gray-50 transition-colors text-left ${
                  inCurrentMonth ? "bg-white" : "bg-gray-100 text-gray-400"
                } ${isToday ? "border-[#C8AB68]" : "border-transparent"}`}
                onClick={() => handleDateClick(day)}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className={isToday ? "font-bold" : ""}>{format(day, "d")}</span>
                </div>
                <div className="flex flex-col gap-1 mt-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      className="text-[10px] rounded-xl px-2 py-1 text-white cursor-pointer text-left w-full"
                      style={{ backgroundColor: event.type?.color || "#7c8cff" }}
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <div className="font-semibold truncate">{event.title}</div>
                      <div className="opacity-80">
                        {format(event.start_date, "HH:mm")} - {format(event.end_date, "HH:mm")}
                      </div>
                    </button>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-[10px] text-gray-500">+ {dayEvents.length - 3} {t("more")}</div>
                  )}
                </div>
              </button>
            );
          })
        )}
      </div>
      <EventFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        initialDate={selectedDate}
        onSuccess={handleEventCreated}
      />
    </div>
  );
}





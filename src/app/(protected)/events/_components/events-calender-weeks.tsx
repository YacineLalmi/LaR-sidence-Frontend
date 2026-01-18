"use client";

import { Event } from "@/schemas/events/event.schema";
import React, { useMemo, useState } from "react";
import ViewEventDialog from "./view-event-dialog";

interface Props {
  events: Event[];
  startDate: Date;
  onEventClick?: (event: Event) => void;
}

// Helper functions
const formatTime = (date: Date) => {
  return date.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
};

const isSameDay = (date1: Date, date2: Date) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

const getWeekDates = (startDate: Date) => {
  const dates = [];
  const day = startDate.getDay();
  const diff = day === 0 ? -6 : 1 - day; // Adjust to Monday

  const monday = new Date(startDate);
  monday.setDate(startDate.getDate() + diff);

  for (let i = 0; i < 7; i++) {
    const date = new Date(monday);
    date.setDate(monday.getDate() + i);
    dates.push(date);
  }

  return dates;
};

export default function EventsCalenderWeeks({ events, startDate, onEventClick }: Props) {
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const daysOfWeek = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

  const weekDates = useMemo(() => getWeekDates(startDate), [startDate]);

  const getEventsForDate = (date: Date) => {
    return events
      .filter((event) => {
        const eventDate = new Date(event.start_date);
        return isSameDay(eventDate, date);
      })
      .sort((a, b) => {
        return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
      });
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsViewEventDialogOpen(true);
  };

  return (
    <div className="overflow-hidden">
      {/* Header with days */}
      <div className="grid grid-cols-7">
        {weekDates.map((date, index) => {
          const isToday = isSameDay(date, new Date());
          return (
            <div key={index} className={`p-4 text-center`}>
              <div className="text-xs font-semibold text-gray-600 mb-2">
                {daysOfWeek[index]}.{date.getDate()}
              </div>
            </div>
          );
        })}
      </div>

      {/* Events grid */}
      <div className="grid grid-cols-7">
        {weekDates.map((date, dayIndex) => {
          const dayEvents = getEventsForDate(date);
          const isToday = isSameDay(date, new Date());

          return (
            <div key={dayIndex} className={`min-h-96 p-3`}>
              <div className="space-y-2">
                {dayEvents.map((event) => {
                  const bgColor = event.type?.color?.background_color || "#E5E7EB";
                  const textColor = event.type?.color?.text_color || "#1F2937";

                  return (
                    <div
                      key={event.id}
                      onClick={() => handleEventClick(event)}
                      style={{ backgroundColor: bgColor, color: textColor }}
                      className="rounded-md p-3 cursor-pointer hover:opacity-90 transition-opacity shadow-smborder-black/10"
                    >
                      <div className="font-semibold text-sm mb-1.5 leading-tight">{event.title}</div>
                      <div className="text-xs opacity-90 mb-2">
                        {formatTime(new Date(event.start_date))} - {formatTime(new Date(event.end_date))}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0">
                          {event.agent.first_name.charAt(0)}
                        </span>
                        <span className="truncate text-xs">
                          {event.agent.first_name} {event.agent.last_name}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {dayEvents.length === 0 && (
                  <div className="text-center text-gray-400 text-sm py-8">Aucun événement</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <ViewEventDialog open={isViewEventDialogOpen} onOpenChange={setIsViewEventDialogOpen} event={selectedEvent} />
    </div>
  );
}

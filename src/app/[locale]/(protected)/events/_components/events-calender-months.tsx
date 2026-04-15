"use client";

import { Event } from "@/schemas/events/event.schema";
import React, { MouseEvent, useMemo, useState } from "react";
import ViewEventDialog from "./view-event-dialog";

interface Props {
  events: Event[];
  startDate: Date;
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

export default function EventsCalendarMonths({ events, startDate }: Props) {
  const [expandedDay, setExpandedDay] = useState<string | null>(null);
  const daysOfWeek = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"];
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const { daysInMonth, startingDayOfWeek, prevMonthDays, nextMonthDays } = useMemo(() => {
    const year = startDate.getFullYear();
    const month = startDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;

    // Get previous month's last days
    const prevMonthLastDay = new Date(year, month, 0);
    const prevMonthTotalDays = prevMonthLastDay.getDate();
    const prevMonthDays = [];
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      prevMonthDays.push({
        day: prevMonthTotalDays - i,
        date: new Date(year, month - 1, prevMonthTotalDays - i),
      });
    }

    // Calculate how many cells for next month
    const totalCells = startingDayOfWeek + daysInMonth;
    const remainingCells = totalCells % 7 === 0 ? 0 : 7 - (totalCells % 7);
    const nextMonthDays = [];
    for (let i = 1; i <= remainingCells; i++) {
      nextMonthDays.push({
        day: i,
        date: new Date(year, month + 1, i),
      });
    }

    return { daysInMonth, startingDayOfWeek, prevMonthDays, nextMonthDays };
  }, [startDate]);

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

  const handleDayClick = (dayKey: string, hasMoreEvents: boolean) => {
    if (hasMoreEvents) {
      setExpandedDay(expandedDay === dayKey ? null : dayKey);
    }
  };

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsViewEventDialogOpen(true);
  };

  return (
    <div className=" overflow-hidden">
      <div className="grid grid-cols-7">
        {daysOfWeek.map((day) => (
          <div key={day} className="p-3 text-center text-sm font-semibold text-gray-700 ">
            {day}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {/* Previous month days */}
        {prevMonthDays.map((item, index) => {
          const dayEvents = getEventsForDate(item.date);
          const day = item.day;
          const dayKey = `prev-${item.date.getFullYear()}-${item.date.getMonth()}-${day}`;
          const isExpanded = expandedDay === dayKey;
          const maxVisible = isExpanded ? dayEvents.length : 3;
          const hasMore = dayEvents.length > 3;

          return (
            <div
              key={`prev-${index}`}
              className={`min-h-28  p-2 relative bg-gray-200 hover:bg-gray-300 transition-colors ${
                isExpanded
                  ? "absolute z-20 shadow-2xl border-2 border-blue-500 min-w-80 max-h-96 overflow-y-auto bg-white"
                  : ""
              }`}
              style={
                isExpanded
                  ? {
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }
                  : {}
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">{day}</div>
                {dayEvents.length > 0 && (
                  <div className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full font-medium">
                    {dayEvents.length}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, maxVisible).map((event) => {
                  const startTime = formatTime(new Date(event.start_date));
                  const endTime = formatTime(new Date(event.end_date));
                  const bgColor = event.type?.color?.background_color || "#E5E7EB";
                  const textColor = event.type?.color?.text_color || "#1F2937";

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                      style={{ backgroundColor: bgColor, color: textColor }}
                      className="rounded-md px-2 py-1.5 text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-sm border border-black/10 opacity-60"
                    >
                      {/* <div className="font-semibold truncate">{event.title}</div> */}
                      <div className="text-[10px] opacity-90 mt-0.5">
                        {startTime} - {endTime}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0">
                          {event.agent?.first_name.charAt(0)}
                        </span>
                        <span className="truncate text-[10px]">
                          {event.agent?.first_name} {event.agent?.last_name}
                        </span>
                        ?
                      </div>
                    </div>
                  );
                })}
                {hasMore && !isExpanded && (
                  <button
                    onClick={() => handleDayClick(dayKey, hasMore)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 font-semibold py-1.5 text-left px-2 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    +{dayEvents.length - 3} événements
                  </button>
                )}
                {isExpanded && (
                  <button
                    onClick={() => setExpandedDay(null)}
                    className="w-full text-xs text-gray-600 hover:text-gray-800 font-semibold py-1.5 text-center hover:bg-gray-100 rounded-md transition-colors mt-2"
                  >
                    Réduire
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Current month days */}
        {[...Array(daysInMonth)].map((_, index) => {
          const date = new Date(startDate.getFullYear(), startDate.getMonth(), index + 1);
          const dayEvents = getEventsForDate(date);
          const isToday = isSameDay(date, new Date());
          const day = index + 1;
          const dayKey = `${startDate.getFullYear()}-${startDate.getMonth()}-${day}`;
          const isExpanded = expandedDay === dayKey;
          const maxVisible = isExpanded ? dayEvents.length : 3;
          const hasMore = dayEvents.length > 3;

          return (
            <div
              key={day}
              className={`min-h-28  p-2 relative hover:bg-amber-50 transition-colors ${
                isExpanded ? "absolute z-20 shadow-2xl border-2 border-blue-500 min-w-80 max-h-96 overflow-y-auto" : ""
              }`}
              style={
                isExpanded
                  ? {
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }
                  : {}
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div
                  className={`text-sm font-medium ${
                    isToday
                      ? "w-7 h-7 bg-blue-600 text-white rounded-full flex items-center justify-center"
                      : "text-gray-700"
                  }`}
                >
                  {day}
                </div>
                {dayEvents.length > 0 && (
                  <div className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full font-medium">
                    {dayEvents.length}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, maxVisible).map((event) => {
                  const startTime = formatTime(new Date(event.start_date));
                  const endTime = formatTime(new Date(event.end_date));
                  const bgColor = event.agent?.color?.background_color || "#E5E7EB";
                  const textColor = event.agent?.color?.text_color || "#1F2937";

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.preventDefault();
                        handleEventClick(event);
                      }}
                      style={{ backgroundColor: bgColor, color: textColor }}
                      className="rounded-md px-2 py-1.5 text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-sm border border-black/10"
                    >
                      {/* <div className="font-semibold truncate">{event.title}</div> */}
                      <div className="text-[10px] opacity-90 mt-0.5">
                        {startTime} - {endTime}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0">
                          {event.agent?.first_name.charAt(0)}
                        </span>
                        <span className="truncate text-[10px]">
                          {event.agent?.first_name} {event.agent?.last_name}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {hasMore && !isExpanded && (
                  <button
                    onClick={() => handleDayClick(dayKey, hasMore)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 font-semibold py-1.5 text-left px-2 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    +{dayEvents.length - 3} événements
                  </button>
                )}
                {isExpanded && (
                  <button
                    onClick={() => setExpandedDay(null)}
                    className="w-full text-xs text-gray-600 hover:text-gray-800 font-semibold py-1.5 text-center hover:bg-gray-100 rounded-md transition-colors mt-2"
                  >
                    Réduire
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {/* Next month days */}
        {nextMonthDays.map((item, index) => {
          const dayEvents = getEventsForDate(item.date);
          const day = item.day;
          const dayKey = `next-${item.date.getFullYear()}-${item.date.getMonth()}-${day}`;
          const isExpanded = expandedDay === dayKey;
          const maxVisible = isExpanded ? dayEvents.length : 3;
          const hasMore = dayEvents.length > 3;

          return (
            <div
              key={`next-${index}`}
              className={`min-h-28 border-r border-b last:border-r-0 p-2 relative bg-gray-200 hover:bg-gray-300 transition-colors ${
                isExpanded
                  ? "absolute z-20 shadow-2xl border-2 border-blue-500 min-w-80 max-h-96 overflow-y-auto bg-white"
                  : ""
              }`}
              style={
                isExpanded
                  ? {
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                    }
                  : {}
              }
            >
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-400">{day}</div>
                {dayEvents.length > 0 && (
                  <div className="text-xs text-gray-400 bg-gray-200 px-2 py-0.5 rounded-full font-medium">
                    {dayEvents.length}
                  </div>
                )}
              </div>
              <div className="space-y-1">
                {dayEvents.slice(0, maxVisible).map((event) => {
                  const startTime = formatTime(new Date(event.start_date));
                  const endTime = formatTime(new Date(event.end_date));
                  const bgColor = event.type?.color?.background_color || "#E5E7EB";
                  const textColor = event.type?.color?.text_color || "#1F2937";

                  return (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                      style={{ backgroundColor: bgColor, color: textColor }}
                      className="rounded-md px-2 py-1.5 text-xs cursor-pointer hover:opacity-90 transition-opacity shadow-sm border border-black/10 opacity-60"
                    >
                      {/* <div className="font-semibold truncate">{event.title}</div> */}
                      <div className="text-[10px] opacity-90 mt-0.5">
                        {startTime} - {endTime}
                      </div>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="w-5 h-5 rounded-full bg-gray-700 flex items-center justify-center text-white font-bold text-[9px] flex-shrink-0">
                          {event.agent?.first_name.charAt(0)}
                        </span>
                        <span className="truncate text-[10px]">
                          {event.agent?.first_name} {event.agent?.last_name}
                        </span>
                      </div>
                    </div>
                  );
                })}
                {hasMore && !isExpanded && (
                  <button
                    onClick={() => handleDayClick(dayKey, hasMore)}
                    className="w-full text-xs text-blue-600 hover:text-blue-800 font-semibold py-1.5 text-left px-2 hover:bg-blue-50 rounded-md transition-colors"
                  >
                    +{dayEvents.length - 3} événements
                  </button>
                )}
                {isExpanded && (
                  <button
                    onClick={() => setExpandedDay(null)}
                    className="w-full text-xs text-gray-600 hover:text-gray-800 font-semibold py-1.5 text-center hover:bg-gray-100 rounded-md transition-colors mt-2"
                  >
                    Réduire
                  </button>
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

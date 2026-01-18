"use client";

import { Event } from "@/schemas/events/event.schema";
import React, { useState } from "react";
import ViewEventDialog from "./view-event-dialog";

interface Props {
  events: Event[];
  date: Date;
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

export default function EventsCalenderDays({ events, date, onEventClick }: Props) {
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState<boolean>(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  // Generate hours (8 to 16)
  const hours = Array.from({ length: 9 }, (_, i) => i + 8);

  const dayEvents = events
    .filter((event) => {
      const eventDate = new Date(event.start_date);
      return isSameDay(eventDate, date);
    })
    .sort((a, b) => {
      return new Date(a.start_date).getTime() - new Date(b.start_date).getTime();
    });

  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsViewEventDialogOpen(true);
  };

  const isToday = isSameDay(date, new Date());

  // Calculate event span
  const getEventSpan = (event: Event) => {
    const startDate = new Date(event.start_date);
    const endDate = new Date(event.end_date);
    const startHour = startDate.getHours();
    const endHour = endDate.getHours();

    // Calculate which column it starts in (relative to hour 8)
    const startCol = Math.max(startHour - 8, 0);
    // Calculate how many columns it spans
    const span = Math.max(endHour - startHour, 1);

    return { startCol, span };
  };

  // Create a grid to track which cells are occupied
  const eventRows: Event[][] = [];

  dayEvents.forEach((event) => {
    const { startCol, span } = getEventSpan(event);

    // Find the first row where this event can fit
    let rowIndex = 0;
    let canFit = false;

    while (!canFit) {
      if (!eventRows[rowIndex]) {
        eventRows[rowIndex] = [];
      }

      // Check if all columns needed are free in this row
      canFit = true;
      for (let col = startCol; col < startCol + span && col < 9; col++) {
        if (eventRows[rowIndex][col]) {
          canFit = false;
          break;
        }
      }

      if (!canFit) {
        rowIndex++;
      }
    }

    // Place the event in this row
    for (let col = startCol; col < startCol + span && col < 9; col++) {
      eventRows[rowIndex][col] = event;
    }
  });

  return (
    <div className="overflow-hidden">
      {/* Time grid header */}
      <div className="grid grid-cols-9 gap-0 sticky top-0z-20">
        {hours.map((hour) => (
          <div key={hour} className="p-3 text-center">
            <span className="text-sm font-semibold text-gray-700">{hour.toString().padStart(2, "0")}h</span>
          </div>
        ))}
      </div>

      {/* Events grid */}
      <div className="overflow-auto max-h-[calc(100vh-280px)]">
        {eventRows.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            <div className="text-lg font-medium mb-2">Aucun événement</div>
            <div className="text-sm">Cette journée est libre</div>
          </div>
        ) : (
          eventRows.map((row, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-9 gap-0 relative" style={{ minHeight: "100px" }}>
              {hours.map((hour, colIndex) => {
                const event = row[colIndex];

                // Check if this is the start of the event (not a continuation)
                const isEventStart = event && (colIndex === 0 || row[colIndex - 1] !== event);

                if (isEventStart) {
                  const { startCol, span } = getEventSpan(event);
                  const bgColor = event.type?.color?.background_color || "#E5E7EB";
                  const textColor = event.type?.color?.text_color || "#1F2937";

                  return (
                    <div
                      key={`${event.id}-${colIndex}`}
                      onClick={() => handleEventClick(event)}
                      style={{
                        backgroundColor: bgColor,
                        color: textColor,
                        gridColumn: `span ${span}`,
                      }}
                      className="m-1 rounded-md p-3 cursor-pointer hover:opacity-90 transition-opacity shadow-sm border border-black/10"
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
                } else if (event) {
                  // This cell is occupied by a continuing event, skip it
                  return null;
                } else {
                  // Empty cell
                  return <div key={`empty-${rowIndex}-${colIndex}`} />;
                }
              })}
            </div>
          ))
        )}
      </div>
      <ViewEventDialog open={isViewEventDialogOpen} onOpenChange={setIsViewEventDialogOpen} event={selectedEvent} />
    </div>
  );
}

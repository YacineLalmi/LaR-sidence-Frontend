"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useCallback, useEffect, useState } from "react";
import { Event } from "@/schemas/events/event.schema";
import getUpcomingEventAction from "@/actions/dashboard/get-upcoming-event.action";
import ViewEventDialog from "../../events/_components/view-event-dialog";

export function EventCard() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [event, setEvent] = useState<Event | null>();
  const [isViewEventOpen, setIsViewEventOpen] = useState<boolean>(false);

  useEffect(() => {
    setIsLoading(true);
    getUpcomingEventAction()
      .then((data) => setEvent(data))
      .catch((error) => console.error(error))
      .finally(() => setIsLoading(false));
  }, []);

  const handleViewEvent = useCallback(() => {
    setIsViewEventOpen(true);
  }, []);

  if (isLoading) {
    return (
      <Card className="rounded-[40px] border-none bg-white p-6 h-full shadow-sm">
        <CardContent className="p-0 space-y-3">
          {/* Main Title Skeleton */}
          <Skeleton className="h-8 w-48 rounded-md" />

          {/* Event Box Skeleton */}
          <div className="rounded-xl bg-sky-50/50 p-2 space-y-2">
            <Skeleton className="h-6 w-32" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="rounded-[40px] border-none bg-white p-6 h-full shadow-sm">
        <CardContent className="p-0">
          <h2 className="text-xl font-bold text-black mb-2">Prochain événement</h2>

          {/* Blue Event Highlight Box */}
          <div
            className="rounded-2xl bg-[#E1F5FE] p-2 border-l-[6px] border-[#4FC3F7] cursor-pointer"
            onClick={handleViewEvent}
          >
            <h3 className="text-md font-semibold text-black mb-2">{event?.title || event?.description}</h3>

            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border border-white">
                {/* <AvatarImage src={userImage} alt={userName} /> */}
                <AvatarFallback>{event?.client?.first_name?.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-gray-700 font-medium">{`${event?.client?.first_name} ${event?.client?.last_name}`}</span>
            </div>
          </div>
        </CardContent>
      </Card>
      {isViewEventOpen && event && (
        <ViewEventDialog event={event} open={isViewEventOpen} onOpenChange={setIsViewEventOpen} />
      )}
    </>
  );
}

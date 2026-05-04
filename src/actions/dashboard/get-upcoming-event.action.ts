"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { Event } from "@/schemas/events/event.schema";
import { DashboardService } from "@/services/dashboard.service";


export default async function getUpcomingEventAction(): Promise<Event | null> {
    try {
        return await DashboardService.getUpcomingEvent();
    } catch (error) {
        await handleServerActionError(error);
        return null
    }
}

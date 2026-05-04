"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { Notification } from "@/schemas/notifications/notification.schema";
import { DashboardService } from "@/services/dashboard.service";


export default async function getNotificationAction(): Promise<Notification[] | null> {
    try {
        return await DashboardService.getNotifications();
    } catch (error) {
        await handleServerActionError(error);
        return null
    }
}

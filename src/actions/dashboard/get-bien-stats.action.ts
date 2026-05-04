"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { Stats } from "@/schemas/dashboard/stats.schema";
import { DashboardService } from "@/services/dashboard.service";


export default async function getBienStatsActions(): Promise<Stats | null> {
    try {
        return await DashboardService.getBienStats();
    } catch (error) {
        await handleServerActionError(error);
        return null
    }
}

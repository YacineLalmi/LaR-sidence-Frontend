"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { Stats } from "@/schemas/dashboard/stats.schema";
import { DashboardService } from "@/services/dashboard.service";


export default async function getDemandStatsActions(): Promise<Stats | null> {
    try {
        return await DashboardService.getDemandStats();
    } catch (error) {
        await handleServerActionError(error);
        return null
    }
}

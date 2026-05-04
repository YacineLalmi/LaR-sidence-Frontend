"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { ChartStats } from "@/schemas/dashboard/chart-stats.schema";
import { DashboardService } from "@/services/dashboard.service";


export default async function getTransactionsAction(range?: string): Promise<ChartStats | null> {
    try {
        const defaultRange = range || "year";
        return await DashboardService.getTransactions(defaultRange);
    } catch (error) {
        await handleServerActionError(error);
        return null
    }
}

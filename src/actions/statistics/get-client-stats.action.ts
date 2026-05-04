"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { BienDistribution } from "@/schemas/dashboard/bien-distribution.schema";
import { StatisticsService } from "@/services/statistics.service";


export default async function getClientStatsActions(groupBy?: string): Promise<BienDistribution[]> {
    try {
        const defaultRange = groupBy || "type";
        return await StatisticsService.getClients(defaultRange);
    } catch (error) {
        await handleServerActionError(error);
        return []
    }
}

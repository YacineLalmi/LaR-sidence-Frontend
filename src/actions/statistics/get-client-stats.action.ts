"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { ClientFilterStatsForm } from "@/schemas/clients/client-filter-stats-form.schema";
import { BienDistribution } from "@/schemas/dashboard/bien-distribution.schema";
import { StatisticsService } from "@/services/statistics.service";


export default async function getClientStatsActions(groupBy: string, filters: ClientFilterStatsForm): Promise<BienDistribution[]> {
    try {
        return await StatisticsService.getClients(groupBy, filters);
    } catch (error) {
        await handleServerActionError(error);
        return []
    }
}

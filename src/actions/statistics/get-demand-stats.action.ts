"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { BienDistribution } from "@/schemas/dashboard/bien-distribution.schema";
import { DemandFilterStatsForm } from "@/schemas/demands/demand-filter-stats-form.schema";
import { StatisticsService } from "@/services/statistics.service";


export default async function getDemandStatsActions(groupBy: string, filters: DemandFilterStatsForm): Promise<BienDistribution[]> {
    try {
        return await StatisticsService.getDemands(groupBy, filters);
    } catch (error) {
        await handleServerActionError(error);
        return []
    }
}

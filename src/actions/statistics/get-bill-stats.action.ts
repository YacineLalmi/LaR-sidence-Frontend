"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { BillingFilterStatsForm } from "@/schemas/bills/bill-filter-stats-form.schema";
import { BienDistribution } from "@/schemas/dashboard/bien-distribution.schema";
import { StatisticsService } from "@/services/statistics.service";


export default async function getBillingStatsActions(groupBy: string, filters: BillingFilterStatsForm): Promise<BienDistribution[]> {
    try {
        return await StatisticsService.getBilling(groupBy, filters);
    } catch (error) {
        await handleServerActionError(error);
        return []
    }
}

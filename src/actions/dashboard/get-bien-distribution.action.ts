"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { BienDistribution } from "@/schemas/dashboard/bien-distribution.schema";
import { DashboardService } from "@/services/dashboard.service";


export default async function getBienDistributionActions(groupBy?: string): Promise<BienDistribution[]> {
    try {
        const defaultRange = groupBy || "type";
        return await DashboardService.getBienDistribution(defaultRange);
    } catch (error) {
        await handleServerActionError(error);
        return []
    }
}

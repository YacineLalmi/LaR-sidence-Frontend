"use server"

import { handleServerActionError } from "@/lib/server.helper";
import { BienDistribution } from "@/schemas/dashboard/bien-distribution.schema";
import { OfferFilterStatsForm } from "@/schemas/offers/offer-filter-stats-form.schema";
import { StatisticsService } from "@/services/statistics.service";


export default async function getOfferStatsActions(groupBy: string, filters: OfferFilterStatsForm): Promise<BienDistribution[]> {
    try {
        return await StatisticsService.getOffers(groupBy, filters);
    } catch (error) {
        await handleServerActionError(error);
        return []
    }
}

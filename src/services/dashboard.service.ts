import { Stats, statsSchema } from "@/schemas/dashboard/stats.schema";
import ApiService from "./api.service";
import { validateResponseData } from "@/lib/utils";
import { Event, EventSchema } from "@/schemas/events/event.schema";
import z from "zod";
import { Notification, NotificationSchema } from "@/schemas/notifications/notification.schema";
import { ChartStats, ChartStatsSchema } from "@/schemas/dashboard/chart-stats.schema";
import { BienDistribution, BienDistributionSchema } from "@/schemas/dashboard/bien-distribution.schema";

const END_POINTS = {
    getBienStats: "/dashboard/stats/bien",
    getDemandStats: "/dashboard/stats/demand",
    getOfferStats: "/dashboard/stats/offer",
    getUpcomingEvent: "/dashboard/upcoming-event",
    getNotifications: "/dashboard/notifications",
    getTransactions: "/dashboard/stats/transactions",
    getBienDistribution: "/dashboard/stats/bienDistribution",
};

export const DashboardService = {
    getBienStats: async () => {
        const response = await ApiService.get<Stats>({
            endpoint: END_POINTS.getBienStats,
            options: {
                cache: "force-cache",
                next: {
                    revalidate: 60
                }
            }
        });
        const validatedResponseData = validateResponseData<Stats>(response.data, statsSchema);

        return validatedResponseData;
    },

    getDemandStats: async () => {
        const response = await ApiService.get<Stats>({
            endpoint: END_POINTS.getDemandStats,
            options: {
                cache: "force-cache",
                next: {
                    revalidate: 60
                }
            }
        });
        const validatedResponseData = validateResponseData<Stats>(response.data, statsSchema);

        return validatedResponseData;
    },

    getOfferStats: async () => {
        const response = await ApiService.get<Stats>({
            endpoint: END_POINTS.getOfferStats,
            options: {
                cache: "force-cache",
                next: {
                    revalidate: 60
                }
            }
        });
        const validatedResponseData = validateResponseData<Stats>(response.data, statsSchema);

        return validatedResponseData;
    },

    getUpcomingEvent: async () => {
        const response = await ApiService.get<Event>({
            endpoint: END_POINTS.getUpcomingEvent,
            options: {
                cache: "force-cache",
                next: {
                    revalidate: 60
                }
            }
        });
        const validatedResponseData = validateResponseData<Event>(response.data, EventSchema);

        return validatedResponseData;
    },

    getNotifications: async () => {
        const response = await ApiService.get<Notification[]>({
            endpoint: END_POINTS.getNotifications,
            options: {
                cache: "force-cache",
                next: {
                    revalidate: 60
                }
            }
        });
        const validatedResponseData = validateResponseData<Notification[]>(response.data, z.array(NotificationSchema));

        return validatedResponseData;
    },

    getTransactions: async (range: string) => {
        const response = await ApiService.get<ChartStats>({
            endpoint: END_POINTS.getTransactions,
            query: { range },
            options: {
                cache: "force-cache",
                next: {
                    revalidate: 60
                }
            }
        });
        const validatedResponseData = validateResponseData<ChartStats>(response.data, ChartStatsSchema);

        return validatedResponseData;
    },

    getBienDistribution: async (groupBy: string) => {
        const response = await ApiService.get<BienDistribution[]>({
            endpoint: END_POINTS.getBienDistribution,
            query: { groupBy },
            options: {
                cache: "force-cache",
                next: {
                    revalidate: 60
                }
            }
        });
        const validatedResponseData = validateResponseData<BienDistribution[]>(response.data, z.array(BienDistributionSchema));

        return validatedResponseData;
    },
};

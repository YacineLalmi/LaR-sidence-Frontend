import ApiService from "./api.service";
import { PaginatedResponse, QueryParams } from "@/lib/definitions";
import { validateResponseData } from "@/lib/utils";
import {
  Notification,
  NotificationAggregates,
  NotificationAggregatesSchema,
  NotificationSchema,
  NotificationSetting,
  NotificationSettingSchema,
} from "@/schemas/notifications/notification.schema";
import z from "zod";

const END_POINTS = {
  notifications: "/notifications",
  aggregates: "/notifications/aggregates",
  markRead: (id: string) => `/notifications/${id}/read`,
  markAllRead: "/notifications/mark-all-read",
  bulkDelete: "/notifications/bulk-delete",
  settings: "/notification-settings",
};

export const NotificationService = {
  findMany: async (query: QueryParams): Promise<PaginatedResponse<Notification>> => {
    const response = await ApiService.get<Notification[]>({
      endpoint: END_POINTS.notifications,
      query,
    });

    const validated = validateResponseData<Notification[]>(response.data, z.array(NotificationSchema));

    return { data: validated, meta: response.meta };
  },

  getAggregates: async (query: QueryParams): Promise<NotificationAggregates> => {
    const response = await ApiService.get<NotificationAggregates>({
      endpoint: END_POINTS.aggregates,
      query,
    });
    return validateResponseData<NotificationAggregates>(response.data, NotificationAggregatesSchema);
  },

  listSettings: async (): Promise<NotificationSetting[]> => {
    const response = await ApiService.get<NotificationSetting[]>({
      endpoint: END_POINTS.settings,
    });
    return validateResponseData<NotificationSetting[]>(response.data, z.array(NotificationSettingSchema));
  },

  updateSettings: async (settings: NotificationSetting[]): Promise<NotificationSetting[]> => {
    const response = await ApiService.put<NotificationSetting[]>({
      endpoint: END_POINTS.settings,
      body: { settings },
    });
    return validateResponseData<NotificationSetting[]>(response.data, z.array(NotificationSettingSchema));
  },
};

export const NotificationEndpoints = END_POINTS;


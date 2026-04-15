import { StatisticsFilters } from "@/schemas/statistics/statistics.schema";
import { format, subDays, subMonths, startOfMonth, endOfMonth } from "date-fns";

function baseFilters(): StatisticsFilters {
  return {
    date_from: format(subDays(new Date(), 30), "yyyy-MM-dd"),
    date_to: format(new Date(), "yyyy-MM-dd"),
    granularity: "month",
  };
}

export type StatisticsTemplate = {
  id: string;
  titleKey: string;
  descriptionKey: string;
  section: string;
  filters: () => StatisticsFilters;
};

export const STATISTICS_TEMPLATES: StatisticsTemplate[] = [
  {
    id: "agent-performance",
    titleKey: "templates.agentPerformance.title",
    descriptionKey: "templates.agentPerformance.description",
    section: "agents",
    filters: () => ({
      ...baseFilters(),
      granularity: "month",
    }),
  },
  {
    id: "agency-monthly",
    titleKey: "templates.agencyMonthly.title",
    descriptionKey: "templates.agencyMonthly.description",
    section: "summary",
    filters: () => ({
      date_from: format(startOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
      date_to: format(endOfMonth(subMonths(new Date(), 1)), "yyyy-MM-dd"),
      granularity: "week",
    }),
  },
  {
    id: "billing",
    titleKey: "templates.billing.title",
    descriptionKey: "templates.billing.description",
    section: "billing",
    filters: () => ({
      ...baseFilters(),
      granularity: "month",
    }),
  },
  {
    id: "client-acquisition",
    titleKey: "templates.clientAcquisition.title",
    descriptionKey: "templates.clientAcquisition.description",
    section: "clients",
    filters: () => ({
      ...baseFilters(),
      granularity: "week",
    }),
  },
];

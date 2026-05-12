import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { NotificationService } from "@/services/notification.service";
import NotificationsView from "./_components/notifications-view";

type SearchParams = {
  page?: string;
  search?: string;
  type?: string;
  priority?: string;
  is_read?: string;
};

function listQueryFromSearchParams(query: SearchParams): Record<string, string> {
  return {
    ...(query.page ? { page: query.page } : {}),
    ...(query.search ? { search: query.search } : {}),
    ...(query.type ? { type: query.type } : {}),
    ...(query.priority ? { priority: query.priority } : {}),
    ...(query.is_read ? { is_read: query.is_read } : {}),
  };
}

export default async function NotificationsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const query = await searchParams;
  const listQuery = listQueryFromSearchParams(query);

  const [result, aggregates] = await Promise.all([
    NotificationService.findMany(listQuery),
    NotificationService.getAggregates(listQuery),
  ]);

  const t = await getTranslations("notifications");

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <NotificationsView initialData={result} aggregates={aggregates} />
      </CardContent>
    </Card>
  );
}

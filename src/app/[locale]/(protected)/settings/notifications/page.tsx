import { Card, CardContent } from "@/components/ui/card";
import { NotificationService } from "@/services/notification.service";
import NotificationSettingsForm from "./_components/notification-settings-form";

export default async function NotificationSettingsPage() {
  const settings = await NotificationService.listSettings();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <NotificationSettingsForm initialSettings={settings} />
      </CardContent>
    </Card>
  );
}

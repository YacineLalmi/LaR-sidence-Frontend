import { Card, CardContent } from "@/components/ui/card";
import UpdateEventForm from "./_components/update-event-form";
import { EventService } from "@/services/event.service";

export default async function UpdateEvent({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const event = await EventService.findOne(id);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <UpdateEventForm event={event} />
      </CardContent>
    </Card>
  );
}

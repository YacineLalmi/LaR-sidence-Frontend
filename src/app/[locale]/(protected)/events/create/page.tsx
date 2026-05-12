import { Card, CardContent } from "@/components/ui/card";
import CreateEventForm from "./_components/create-event-form";

export default async function EventAdd() {
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <CreateEventForm />
      </CardContent>
    </Card>
  );
}

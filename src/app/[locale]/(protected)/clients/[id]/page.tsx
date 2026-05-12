import { ClientService } from "@/services/client.service";
import UpdateClientForm from "./_components/update-client-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function UpdateForm({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const client = await ClientService.findOne(id);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <UpdateClientForm client={client} />
      </CardContent>
    </Card>
  );
}

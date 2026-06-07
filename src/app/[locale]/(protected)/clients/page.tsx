import { ClientService } from "@/services/client.service";
import ClientTable from "./_components/client-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ClientHeader from "./_components/client-header";

export default async function Clients({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const clients = await ClientService.findMany({ ...queryParams, include: "status.color,source" });

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <ClientHeader />
      </CardHeader>
      <CardContent className="px-0">
        <ClientTable data={clients} />
      </CardContent>
    </Card>
  );
}

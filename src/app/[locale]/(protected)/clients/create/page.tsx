import CreateClientForm from "./_components/create-client-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function ClientAdd() {
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <CreateClientForm />;
      </CardContent>
    </Card>
  );
}

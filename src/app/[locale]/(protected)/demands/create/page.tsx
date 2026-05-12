import CreateDemandForm from "./_components/create-demand-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function AddDemandPage() {
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <CreateDemandForm />
      </CardContent>
    </Card>
  );
}

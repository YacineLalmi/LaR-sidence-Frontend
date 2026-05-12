import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateBillForm from "./_components/create-bill-form";

export default async function CreateBillPage() {
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <CreateBillForm />
      </CardContent>
    </Card>
  );
}

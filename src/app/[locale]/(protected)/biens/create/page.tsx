import { Card, CardContent, CardHeader } from "@/components/ui/card";
import CreateBienForm from "./_components/create-bien-form";

export default async function BienStatusAddPage() {
  return (
    <Card className="bg-transparent shadow-none border-none p-0">
      <CardContent>
        <CreateBienForm />
      </CardContent>
    </Card>
  );
}

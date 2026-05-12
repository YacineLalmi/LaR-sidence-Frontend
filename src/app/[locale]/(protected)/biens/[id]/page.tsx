import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UpdateBienForm from "./_components/update-bien-form";
import { BienService } from "@/services/bien.service";

export default async function UpdateBienPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;

  const bien = await BienService.findOne(id);

  return (
    <Card className="bg-transparent shadow-none border-none p-0">
      <CardContent>
        <UpdateBienForm bien={bien} />
      </CardContent>
    </Card>
  );
}

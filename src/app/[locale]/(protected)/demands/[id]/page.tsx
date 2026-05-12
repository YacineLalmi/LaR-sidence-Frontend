import { Card, CardContent } from "@/components/ui/card";
import UpdateDemandForm from "./_components/update-demand-form";
import { DemandService } from "@/services/demand.service";

export default async function DemandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const demand = await DemandService.findOne(id);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <UpdateDemandForm demand={demand} />
      </CardContent>
    </Card>
  );
}

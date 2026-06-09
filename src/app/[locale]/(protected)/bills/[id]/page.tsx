import { Card, CardContent, CardHeader } from "@/components/ui/card";
import UpdateBillForm from "./_components/update-bill-form";
import { BillService } from "@/services/bill.service";

export default async function DemandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const bill = await BillService.findOne(id, { include: "client,bien,status,billingModel,media" });

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <UpdateBillForm bill={bill} />
      </CardContent>
    </Card>
  );
}

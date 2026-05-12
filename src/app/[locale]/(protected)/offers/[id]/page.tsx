import UpfateOfferForm from "./_components/update-offer-form";
import { Card, CardContent } from "@/components/ui/card";
import { OfferService } from "@/services/offer.service";

export default async function UpdateForm({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const offer = await OfferService.findOne(id);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <UpfateOfferForm offer={offer} />
      </CardContent>
    </Card>
  );
}

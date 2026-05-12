import CreateOfferForm from "./_components/create-offer-form";
import { Card, CardContent } from "@/components/ui/card";

export default async function OfferAdd() {
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardContent className="px-0">
        <CreateOfferForm />
      </CardContent>
    </Card>
  );
}

import OffersTable from "./_components/offer-table";
import { OfferService } from "@/services/offer.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import OffersHeader from "./_components/offer-header";

export default async function Offers({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const offers = await OfferService.findMany({ ...queryParams, include: "status.color,type,bien,client" });

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <OffersHeader />
      </CardHeader>
      <CardContent className="px-0">
        <OffersTable data={offers} />
      </CardContent>
    </Card>
  );
}

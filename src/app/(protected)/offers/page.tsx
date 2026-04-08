import { getTranslations } from "next-intl/server";
import OffersTable from "./_components/offer-table";
import { OfferService } from "@/services/offer.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import OffersHeader from "./_components/offer-header";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default async function Offers({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const offers = await OfferService.findMany({ ...queryParams, include: "status.color,type,bien,client" });

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[24px] font-bold">{translation(TRANSLATIONS_KEYS_2.OFFERS.TITLE)}</h1>
        <OffersHeader />
      </CardHeader>
      <CardContent className="px-0">
        <OffersTable data={offers} />
      </CardContent>
    </Card>
  );
}

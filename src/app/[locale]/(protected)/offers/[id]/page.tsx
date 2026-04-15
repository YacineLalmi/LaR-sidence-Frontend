import UpfateOfferForm from "./_components/update-offer-form";
import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { OfferService } from "@/services/offer.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function UpdateForm({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const translation = await getTranslations();
  const offer = await OfferService.findOne(id);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.TITLES.UPDATE)}
          backLink={ROUTES.OFFERS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpfateOfferForm offer={offer} />
      </CardContent>
    </Card>
  );
}

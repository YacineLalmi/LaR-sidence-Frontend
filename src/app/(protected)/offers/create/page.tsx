import { ClientService } from "@/services/client.service";
import CreateOfferForm from "./_components/create-offer-form";
import { BienService } from "@/services/bien.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function OfferAdd() {
  const translation = await getTranslations();
  const biens = await BienService.list();
  const clients = await ClientService.list();
  const offerTypes = await ClassificationService(CATEGORIES.TYPE, SCOPES.OFFER).list();
  const offerStatus = await ClassificationService(CATEGORIES.STATUS, SCOPES.OFFER).list();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.TITLES.CREATE)}
          backLink={ROUTES.OFFERS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateOfferForm types={offerTypes} status={offerStatus} clients={clients} biens={biens} />
      </CardContent>
    </Card>
  );
}

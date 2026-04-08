import CreateOfferForm from "./_components/create-offer-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function OfferAdd() {
  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.TITLES.CREATE)}
          backLink={ROUTES.OFFERS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateOfferForm />
      </CardContent>
    </Card>
  );
}

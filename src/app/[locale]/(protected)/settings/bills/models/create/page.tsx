import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";
import CreateBillingModelForm from "./_components/create-billing-model-form";

export default async function AddDemandPage() {
  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.TITLES.CREATE)}
          backLink={ROUTES.SETTINGS.BILLS.MODELS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateBillingModelForm />
      </CardContent>
    </Card>
  );
}

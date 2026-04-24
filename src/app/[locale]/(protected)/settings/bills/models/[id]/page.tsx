import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";
import UpdateBillingModelForm from "./_components/update-billing-model-form";
import { BillingModelService } from "@/services/billing-model.service";

export default async function DemandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const translation = await getTranslations();
  const billingModel = await BillingModelService.findOne(id);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.TITLES.UPDATE)}
          backLink={ROUTES.SETTINGS.BILLS.MODELS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpdateBillingModelForm billingModel={billingModel} />
      </CardContent>
    </Card>
  );
}

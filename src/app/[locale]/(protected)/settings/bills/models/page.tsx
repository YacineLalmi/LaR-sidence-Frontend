import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import BillingModelHeader from "./_components/billing-model-header";
import BillingModelsTable from "./_components/billing-models-table";
import { BillingModelService } from "@/services/billing-model.service";

export default async function BillingModels({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const billingModels = await BillingModelService.findMany({ ...queryParams });

  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.TITLE)}</h1>
        <BillingModelHeader />
      </CardHeader>
      <CardContent className="px-0">
        <BillingModelsTable data={billingModels} />
      </CardContent>
    </Card>
  );
}

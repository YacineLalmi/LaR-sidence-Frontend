import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { ColorService } from "@/services/colors.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreatePaymentStatusDialog from "./_components/create-payment-status-dialog";
import PaymentStatusTable from "./_components/payment-status-table";

export default async function PaymentStatus({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.STATUS, SCOPES.PAYMENT).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.PAYMENTS.STATUSES.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreatePaymentStatusDialog />}
      error={responseError}
    >
      <PaymentStatusTable data={result} />
    </SettingsView>
  );
}

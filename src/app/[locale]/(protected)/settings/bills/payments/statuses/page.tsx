import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import CreatePaymentStatusDialog from "./_components/create-payment-status-dialog";
import PaymentStatusTable from "./_components/payment-status-table";

export default async function PaymentStatus({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.STATUS, SCOPES.PAYMENT).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView searchField={<SearchField />} createComponent={<CreatePaymentStatusDialog />} error={responseError}>
      <PaymentStatusTable data={result} />
    </SettingsView>
  );
}

import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import CreateTransactionTypeDialog from "./_components/create-transaction-type-dialog";
import TransactionTypeTable from "./_components/transaction-type-table";

export default async function TransactionType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.TYPE, SCOPES.TRANSACTION).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView searchField={<SearchField />} createComponent={<CreateTransactionTypeDialog />} error={responseError}>
      <TransactionTypeTable data={result} />
    </SettingsView>
  );
}

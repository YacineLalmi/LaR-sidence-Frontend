import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { ColorService } from "@/services/colors.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateTransactionTypeDialog from "./_components/create-transaction-type-dialog";
import TransactionTypeTable from "./_components/transaction-type-table";

export default async function BienType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const colors = await ColorService.list();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.TYPE, SCOPES.TRANSACTION).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.TRANSACTIONS.TYPES.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreateTransactionTypeDialog colors={colors} />}
      error={responseError}
    >
      <TransactionTypeTable data={result} colors={colors} />
    </SettingsView>
  );
}

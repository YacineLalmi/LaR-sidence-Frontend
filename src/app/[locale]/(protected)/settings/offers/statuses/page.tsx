import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { ColorService } from "@/services/colors.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateOfferStatusDialog from "./_components/create-client-status-dialog";
import OfferStatusTable from "./_components/client-status-table";

export default async function StatusType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  const colors = await ColorService.list();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.STATUS, SCOPES.OFFER).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.OFFERS.STATUSES.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreateOfferStatusDialog colors={colors} />}
      error={responseError}
    >
      <OfferStatusTable data={result} colors={colors} />
    </SettingsView>
  );
}

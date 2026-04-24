import { getTranslations } from "next-intl/server";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { ColorService } from "@/services/colors.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateBienCharacteristicDialog from "./_components/create-bien-characteristic-dialog";
import BienCharacteristicTable from "./_components/bien-characteristic-table";

export default async function BienCharacteristics({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const queryParams = await searchParams;
  const translation = await getTranslations();

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.CHARACTERISTIC, SCOPES.BIEN).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.CHARACTERISTICS.TITLE)}
      searchField={<SearchField />}
      createComponent={<CreateBienCharacteristicDialog />}
      error={responseError}
    >
      <BienCharacteristicTable data={result} />
    </SettingsView>
  );
}

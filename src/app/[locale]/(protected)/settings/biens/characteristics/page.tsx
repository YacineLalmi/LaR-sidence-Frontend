import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import CreateBienCharacteristicDialog from "./_components/create-bien-characteristic-dialog";
import BienCharacteristicTable from "./_components/bien-characteristic-table";

export default async function BienCharacteristics({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>;
}) {
  const queryParams = await searchParams;

  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.CHARACTERISTIC, SCOPES.BIEN).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      searchField={<SearchField />}
      createComponent={<CreateBienCharacteristicDialog />}
      error={responseError}
    >
      <BienCharacteristicTable data={result} />
    </SettingsView>
  );
}

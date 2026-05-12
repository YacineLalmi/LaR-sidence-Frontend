import BienTypeTable from "./_components/bien-type-table";
import SearchField from "@/components/ui/search";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Classification } from "@/schemas/classification/classification.schema";
import CreateBienTypeDialog from "./_components/create-bien-type-dialog";
import { ROUTES } from "@/constants/routes";

export default async function BienType({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;
  let result: PaginatedResponse<Classification> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await ClassificationService(CATEGORIES.TYPE, SCOPES.BIEN).findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }
  return (
    <SettingsView
      searchField={<SearchField />}
      createComponent={<CreateBienTypeDialog />}
      error={responseError}
      backLink={ROUTES.SETTINGS.ROOT}
    >
      <BienTypeTable data={result} />
    </SettingsView>
  );
}

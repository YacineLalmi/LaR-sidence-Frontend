import SearchField from "@/components/ui/search";
import WilayasTable from "./wilayas-table";
import CreateWilayaDialog from "./create-wilaya-dialog";
import { WilayaService } from "@/services/wilaya.service";
import { getTranslations } from "next-intl/server";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  searchParams: { [key: string]: string | undefined }; // Use undefined for safer access
}

export default async function WilayaView({ searchParams }: Props) {
  const translation = await getTranslations();

  const { wilayas_page = "1", wilaya_search = "" } = searchParams;

  const queryParams = {
    page: wilayas_page,
    search: wilaya_search,
  };

  let result: PaginatedResponse<Wilaya> = { data: [], meta: undefined };
  let responseError: Error | null = null;

  try {
    result = await WilayaService.findMany(queryParams);
  } catch (error: any) {
    responseError = error;
  }

  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.TITLE)}
      searchField={<SearchField prefix="wilaya" />}
      createComponent={<CreateWilayaDialog />}
      error={responseError}
    >
      <WilayasTable data={result} />
    </SettingsView>
  );
}

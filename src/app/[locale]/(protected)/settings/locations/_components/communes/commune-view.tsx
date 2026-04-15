import { CommuneService } from "@/services/commune.service";
import CommuneTable from "./communes-table";
import { WilayaService } from "@/services/wilaya.service";
import SelectWilayaInput from "./select-wilaya-input";
import CreateCommuneDialog from "./create-commune-dialog";
import { getTranslations } from "next-intl/server";
import SettingsView from "@/views/settings.view";
import { PaginatedResponse } from "@/lib/definitions";
import { Commune } from "@/schemas/communes/commune.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { getWilayaListAction } from "@/actions/wilayas/get-wilaya-list.action";

interface Props {
  searchParams: { [key: string]: string | undefined };
}

export default async function CommuneView({ searchParams }: Props) {
  const translation = await getTranslations();

  // Destructure search params
  const { wilaya_id, communes_page = "1" } = searchParams;
  const selectedWilayaId = wilaya_id || "1";

  const queryParams = {
    page: communes_page,
  };

  // Initialize data structures with generic types
  let result: PaginatedResponse<Commune> = { data: [], meta: undefined };
  let wilayas: any[] = []; // Assuming WilayaService.list returns a simple array
  let responseError: Error | null = null;

  try {
    // Fetch both resources in parallel
    const [communesData, wilayasData] = await Promise.all([
      CommuneService.findByWilaya(selectedWilayaId, queryParams),
      getWilayaListAction(),
    ]);

    result = communesData;
    wilayas = wilayasData;
  } catch (error: any) {
    responseError = error;
  }

  return (
    <SettingsView
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.TITLE)}
      searchField={<SelectWilayaInput wilayas={wilayas} selectedWilayaId={selectedWilayaId} />}
      createComponent={<CreateCommuneDialog wilayas={wilayas} />}
      error={responseError}
    >
      <CommuneTable data={result} wilayas={wilayas} />
    </SettingsView>
  );
}

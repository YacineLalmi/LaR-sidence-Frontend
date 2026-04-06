import { UserService } from "@/services/user.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { WilayaService } from "@/services/wilaya.service";
import CreateBienForm from "./_components/create-bien-form";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { ClientService } from "@/services/client.service";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function BienStatusAddPage() {
  const translation = await getTranslations();
  const bienTypes = await ClassificationService(CATEGORIES.TYPE, SCOPES.BIEN).list();
  const status = await ClassificationService(CATEGORIES.STATUS, SCOPES.BIEN).list();
  const transactionsTypes = await ClassificationService(CATEGORIES.TYPE, SCOPES.TRANSACTION).list();
  const priorities = await ClassificationService(CATEGORIES.PRIORITY, SCOPES.BIEN).list();
  const bienCharacteristics = await ClassificationService(CATEGORIES.CHARACTERISTIC, SCOPES.BIEN).list();
  const wilayas = await WilayaService.list();
  const agents = await UserService.agentList();
  const clients = await ClientService.list();

  return (
    <Card className="bg-transparent shadow-none border-none p-0">
      <CardHeader className="flex items-center gap-2">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.BUTTONS.CREATE)}
          backLink={ROUTES.BIENS.ROOT}
        />
      </CardHeader>
      <CardContent>
        <CreateBienForm
          agents={agents}
          bienTypes={bienTypes}
          status={status}
          transactionsTypes={transactionsTypes}
          wilayas={wilayas}
          priorities={priorities}
          clients={clients}
          bienCharacteristics={bienCharacteristics}
        />
      </CardContent>
    </Card>
  );
}

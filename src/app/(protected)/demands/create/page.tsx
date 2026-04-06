import { getTranslations } from "next-intl/server";
import CreateDemandForm from "./_components/create-demand-form";
import { BienService } from "@/services/bien.service";
import { UserService } from "@/services/user.service";
import { ClientService } from "@/services/client.service";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function AddDemandPage() {
  const translation = await getTranslations();

  const demandsTypes = await ClassificationService(CATEGORIES.TYPE, SCOPES.DEMAND)
    .list()
    .catch(() => []);
  const demandStatus = await ClassificationService(CATEGORIES.STATUS, SCOPES.DEMAND)
    .list()
    .catch(() => []);
  const demandPriorities = await ClassificationService(CATEGORIES.PRIORITY, SCOPES.DEMAND)
    .list()
    .catch(() => []);
  const demandSources = await ClassificationService(CATEGORIES.SOURCE, SCOPES.DEMAND)
    .list()
    .catch(() => []);
  const clients = await ClientService.list();
  const biens = await BienService.list();
  const agents = await UserService.agentList().catch(() => []);

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.TITLES.CREATE)}
          backLink={ROUTES.DEMANDS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateDemandForm
          types={demandsTypes}
          status={demandStatus}
          priorities={demandPriorities}
          sources={demandSources}
          clients={clients}
          biens={biens}
          agents={agents}
        />
      </CardContent>
    </Card>
  );
}

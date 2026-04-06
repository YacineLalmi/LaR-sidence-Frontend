import { ClientService } from "@/services/client.service";
import UpdateClientForm from "./_components/update-client-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function UpdateForm({ params }: { params: Promise<{ id: string }> }) {
  const id = (await params).id;
  const translation = await getTranslations();
  const clientTypes = await ClassificationService(CATEGORIES.TYPE, SCOPES.CLEINT).list();
  const clientStatus = await ClassificationService(CATEGORIES.STATUS, SCOPES.CLEINT).list();
  const clientSources = await ClassificationService(CATEGORIES.SOURCE, SCOPES.CLEINT).list();
  const client = await ClientService.findOne(id);
  const civilities = [
    {
      id: "mrs",
      name: "Female",
    },
    {
      id: "mr",
      name: "Male",
    },
    {
      id: "company",
      name: "Company",
    },
  ];

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <NavigationButton
          title={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.TITLES.UPDATE)}
          backLink={ROUTES.CLIENTS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <UpdateClientForm
          types={clientTypes}
          status={clientStatus}
          sources={clientSources}
          civilities={civilities}
          client={client}
        />
      </CardContent>
    </Card>
  );
}

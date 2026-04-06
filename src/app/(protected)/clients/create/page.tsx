import CreateClientForm from "./_components/create-client-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import NavigationButton from "@/components/ui/navigation-button";
import { getTranslations } from "next-intl/server";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";

export default async function ClientAdd() {
  const translation = await getTranslations();
  const clientTypes = await ClassificationService(CATEGORIES.TYPE, SCOPES.CLEINT).list();
  const clientStatus = await ClassificationService(CATEGORIES.STATUS, SCOPES.CLEINT).list();
  const clientSources = await ClassificationService(CATEGORIES.SOURCE, SCOPES.CLEINT).list();
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
          title={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.TITLES.CREATE)}
          backLink={ROUTES.CLIENTS.ROOT}
        />
      </CardHeader>
      <CardContent className="px-0">
        <CreateClientForm types={clientTypes} status={clientStatus} sources={clientSources} civilities={civilities} />;
      </CardContent>
    </Card>
  );
}

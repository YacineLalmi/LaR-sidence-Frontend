import { getTranslations } from "next-intl/server";
import { ClientService } from "@/services/client.service";
import ClientTable from "./_components/client-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ClientHeader from "./_components/client-header";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { CATEGORIES, ClassificationService, SCOPES } from "@/services/classification.service";

export default async function Clients({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const clients = await ClientService.findMany({ ...queryParams, include: "status.color" });
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
  const translation = await getTranslations();
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS_2.CLIENTS.TITLE)}</h1>
        <ClientHeader types={clientTypes} status={clientStatus} sources={clientSources} civilities={civilities} />
      </CardHeader>
      <CardContent className="px-0">
        <ClientTable data={clients} />
      </CardContent>
    </Card>
  );
}

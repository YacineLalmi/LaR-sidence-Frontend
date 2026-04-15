import { getTranslations } from "next-intl/server";
import { DemandService } from "@/services/demand.service";
import DemandsTable from "./_components/demands-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DemandsHeader from "./_components/demands-header";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default async function Bills({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const demands = await DemandService.findMany({ ...queryParams, include: "type,client,agent,status.color" });

  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS_2.DEMANDS.TITLE)}</h1>
        <DemandsHeader />
      </CardHeader>
      <CardContent className="px-0">
        <DemandsTable data={demands} />
      </CardContent>
    </Card>
  );
}

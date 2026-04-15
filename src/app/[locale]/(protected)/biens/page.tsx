import { BienService } from "@/services/bien.service";
import { getTranslations } from "next-intl/server";
import BienTable from "./_components/bien-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BienHeader from "./_components/bien-header";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

export default async function Biens({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await BienService.findMany({ ...queryParams, include: "transactionType,bienType,bienStatus.color" });
  const translation = await getTranslations();
  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS_2.BIENS.TITLE)}</h1>
        <BienHeader />
      </CardHeader>
      <CardContent className="px-0">
        <BienTable data={data} />
      </CardContent>
    </Card>
  );
}

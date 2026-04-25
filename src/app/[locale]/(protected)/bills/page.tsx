import { getTranslations } from "next-intl/server";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { BillService } from "@/services/bill.service";
import BillsHeader from "./_components/bill-header";
import BillsTable from "./_components/bills-table";

export default async function Bills({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  let queryParams = await searchParams;

  queryParams = {
    ...queryParams,
    include: "client,bien,status.color,billingModel",
  };

  const bills = await BillService.findMany(queryParams);

  const translation = await getTranslations();

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <h1 className="text-[32px] font-bold">{translation(TRANSLATIONS_KEYS_2.BILLS.TITLE)}</h1>
        <BillsHeader />
      </CardHeader>
      <CardContent className="px-0">
        <BillsTable data={bills} />
      </CardContent>
    </Card>
  );
}

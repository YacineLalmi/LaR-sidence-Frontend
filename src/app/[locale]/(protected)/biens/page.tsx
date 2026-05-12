import { BienService } from "@/services/bien.service";
import BienTable from "./_components/bien-table";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import BienHeader from "./_components/bien-header";

export default async function Biens({ searchParams }: { searchParams: Promise<{ [key: string]: string }> }) {
  const queryParams = await searchParams;

  const data = await BienService.findMany({ ...queryParams, include: "transactionType,bienType,bienStatus.color" });

  return (
    <Card className="bg-transparent border-none shadow-none p-0">
      <CardHeader className="px-0 flex flex-col">
        <BienHeader />
      </CardHeader>
      <CardContent className="px-0">
        <BienTable data={data} />
      </CardContent>
    </Card>
  );
}

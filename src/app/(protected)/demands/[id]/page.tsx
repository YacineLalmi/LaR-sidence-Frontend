import { getTranslations } from "next-intl/server";
import { DemandsService } from "@/services/demands.service";
import DemandDetailView from "./_components/detail-view";
import { notFound } from "next/navigation";

export default async function DemandDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();

  try {
    const demand = await DemandsService.findOne(id);

    return (
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("demands.detail.title")}</h1>
        </div>
        <div>
          <DemandDetailView demand={demand} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}


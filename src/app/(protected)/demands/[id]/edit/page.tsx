import { getTranslations } from "next-intl/server";
import { DemandsService } from "@/services/demands.service";
import { ClientService } from "@/services/client.service";
import { BienService } from "@/services/bien.service";
import { UserService } from "@/services/user.service";
import { notFound } from "next/navigation";
import UpdateDemandForm from "../_components/update-form";

export default async function EditDemandPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const t = await getTranslations();

  try {
    const demand = await DemandsService.findOne(id);
    const types = await DemandsService.typesList().catch(() => []);
    const status = await DemandsService.statusList().catch(() => []);
    const priorities = await DemandsService.prioritiesList().catch(() => []);
    const sources = await DemandsService.sourcesList().catch(() => []);
    const clients = await ClientService.list();
    const biens = await BienService.list();
    const agents = await UserService.agentList().catch(() => []);

    return (
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-2xl font-bold">{t("demands.form.editTitle")}</h1>
        </div>
        <div>
          <UpdateDemandForm
            demand={demand}
            types={types}
            status={status}
            priorities={priorities}
            sources={sources}
            clients={clients}
            biens={biens}
            agents={agents}
          />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

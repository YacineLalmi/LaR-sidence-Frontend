import { getTranslations } from "next-intl/server";
import { DemandsService } from "@/services/demands.service";
import CreateDemandForm from "./_components/create-form";
import { BienService } from "@/services/bien.service";
import { UserService } from "@/services/user.service";
import { ClientService } from "@/services/client.service";

export default async function AddDemandPage() {
  const t = await getTranslations();

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
        <h1 className="text-2xl font-bold">{t("demands.form.createTitle")}</h1>
      </div>
      <div>
        <CreateDemandForm
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
}


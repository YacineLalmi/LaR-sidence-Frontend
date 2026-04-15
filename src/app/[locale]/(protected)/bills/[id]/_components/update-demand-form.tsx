"use client";

import { updateDemandAction } from "@/actions/demands/update-demand.action";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { DemandForm as DemandFormType } from "@/schemas/demands/demand-form.schema";
import { Demand } from "@/schemas/demands/demand.schema";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import DemandForm from "../../_components/demand-form";

interface Props {
  demand: Demand;
}

export default function UpdateDemandForm({ demand }: Props) {
  const router = useRouter();

  const initialData: DemandFormType = {
    type_id: demand.type?.id || "",
    client_id: demand.client?.id || "",
    source_id: demand.source?.id || "",
    bien_id: demand.bien?.id || "",
    agent_id: demand.agent?.id || "",
    status_id: demand.status?.id || "",
    priority_id: demand.priority?.id || "",
    budget: demand.budget,
    comment: demand.comment,
  };
  const onSuccess = useCallback(() => {
    router.push(ROUTES.DEMANDS.ROOT);
  }, [router]);

  return (
    <DemandForm
      initialData={initialData}
      submitAction={(values: DemandFormType) => updateDemandAction(values, demand.id)}
      successMessage={TRANSLATIONS_KEYS_2.DEMANDS.FORM.MESSAGES.UPDATED}
      errorMessage={TRANSLATIONS_KEYS_2.DEMANDS.FORM.MESSAGES.FAILED_UPDATE}
      formId="update-demand-form"
      successAction={onSuccess}
    />
  );
}

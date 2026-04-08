"use client";

import { createDemandAction } from "@/actions/demands/create-demand.action";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { DemandForm as DemandFormType } from "@/schemas/demands/demand-form.schema";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import DemandForm from "../../_components/demand-form";

export default function CreateDemandForm() {
  const router = useRouter();

  const initialData: DemandFormType = {
    type_id: "",
    client_id: "",
    source_id: "",
    bien_id: "",
    agent_id: "",
    status_id: "",
    priority_id: "",
    budget: "",
    comment: "",
  };

  const onSuccess = useCallback(() => {
    router.push(ROUTES.DEMANDS.ROOT);
  }, [router]);

  return (
    <DemandForm
      initialData={initialData}
      submitAction={createDemandAction}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.CREATED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.FAILED_CREATION}
      formId="create-demand-form"
      successAction={onSuccess}
    />
  );
}

"use client";

import { createClientAction } from "@/actions/clients/create-client.action";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ClientForm as ClientFormType } from "@/schemas/clients/client-form.schema";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import ClientForm from "../../_components/client-form";

export default function CreateClientForm() {
  const router = useRouter();

  const initialData: ClientFormType = {
    civility: "mrs",
    last_name: "",
    first_name: "",
    source_id: "",
    email: null,
    phone_numbers: [],
    documents: [],
    comment: "",
    company_name: "",
    trade_register: "",
    tax_identification: "",
    mobile: "",
    ai: "",
    status_id: "",
    type_id: "",
  };

  const onSuccess = useCallback(() => {
    router.push(ROUTES.CLIENTS.ROOT);
  }, [router]);

  return (
    <ClientForm
      initialData={initialData}
      submitAction={createClientAction}
      successAction={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.CREATED}
      errorMessage={TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.FAILED_CREATION}
      formId={"create-client-id"}
    />
  );
}

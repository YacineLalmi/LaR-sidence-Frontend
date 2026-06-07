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
    email: null,
    mobile: "",
    phone_numbers: [],
    comment: "",
    company_name: null,
    trade_register: null,
    tax_identification: null,
    ai: null,
    source_id: "",
    status_id: "",
    type_id: "",
    new_documents: [],
    deleted_documents: [],
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
      formId="create-client-id"
      existingDocuments={[]}
      setExistingDocuments={() => {}}
      isLoading={false}
    />
  );
}

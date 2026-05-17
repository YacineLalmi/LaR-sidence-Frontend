"use client";

import { updateClientAction } from "@/actions/clients/update-client.action";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ClientForm as ClientFormType } from "@/schemas/clients/client-form.schema";
import { Client } from "@/schemas/clients/client.schema";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import ClientForm from "../../_components/client-form";

interface Props {
  client: Client;
}

export default function UpdateClientForm({ client }: Props) {
  const router = useRouter();

  const initialData: ClientFormType = {
    civility: client.civility,
    first_name: client.first_name,
    last_name: client.last_name,
    email: client.email,
    phone_numbers: client.phone_numbers || [],
    comment: client.comment || "",
    company_name: client.company_name,
    trade_register: client.trade_register,
    tax_identification: client.tax_identification,
    mobile: client.mobile,
    ai: client.ai,
    source_id: client.source?.id || "",
    status_id: client.status?.id || "",
    type_id: client.type?.id || "",
    new_documents: [],
    deleted_documents: [],
  };

  const onSuccess = useCallback(() => {
    router.push(ROUTES.CLIENTS.ROOT);
  }, [router]);

  return (
    <ClientForm
      initialData={initialData}
      submitAction={async (values: ClientFormType) => await updateClientAction(values, client.id)}
      successAction={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.UPDATED}
      errorMessage={TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.FAILED_UPDATE}
      formId="update-client-id"
      existingDocuments={client.documents || []}
      isUpdate={true}
    />
  );
}

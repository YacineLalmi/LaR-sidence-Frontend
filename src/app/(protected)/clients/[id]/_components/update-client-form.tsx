"use client";

import { createClientAction } from "@/actions/clients/create-client.action";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ClientForm as ClientFormType } from "@/schemas/clients/client-form.schema";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ClientForm from "../../_components/client-form";
import { Client } from "@/schemas/clients/client.schema";

interface Props {
  client: Client;
}
export default function UpdateClientForm({ client }: Props) {
  const router = useRouter();
  const [areFileLoading, setAreFilesLoading] = useState<boolean>(false);

  const initialData: ClientFormType = {
    civility: client.civility,
    last_name: client.first_name,
    first_name: client.last_name,
    email: client.email,
    phone_numbers: client.phone_numbers || [],
    documents: [],
    comment: client.comment,
    company_name: client.company_name,
    trade_register: client.trade_register,
    tax_identification: client.tax_identification,
    mobile: client.mobile,
    ai: client.ai,
    source_id: client.source?.id || "",
    status_id: client.status?.id || "",
    type_id: client.type?.id || "",
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
      documents={client.documents}
    />
  );
}

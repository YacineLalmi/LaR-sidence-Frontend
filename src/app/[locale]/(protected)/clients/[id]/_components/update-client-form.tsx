"use client";

import { updateClientAction } from "@/actions/clients/update-client.action";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ClientForm as ClientFormType } from "@/schemas/clients/client-form.schema";
import { Client } from "@/schemas/clients/client.schema";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ClientForm from "../../_components/client-form";
import { getMediaAsBlobAction } from "@/actions/media/get-media.actions";
import { customToast } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  client: Client;
}

export default function UpdateClientForm({ client }: Props) {
  const router = useRouter();
  const translation = useTranslations();

  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState<File[]>([]);

  // Load existing files and convert them to File objects
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoadingFiles(true);
      try {
        // Fetch documents
        const documentPromises = client.documents?.map((doc) => getMediaAsBlobAction(doc)) || [];
        const documents = await Promise.all(documentPromises);
        const validDocuments = documents
          .filter((doc) => !!doc)
          .map((doc) => {
            const binaryString = window.atob(doc.base64);
            const bytes = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            return new File([bytes], doc.name + "#" + doc.uuid, { type: doc.mimeType });
          });

        setExistingDocuments(validDocuments);
      } catch (error) {
        console.error("Error loading files:", error);
        customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.LOADING_FILE_FAILED));
      } finally {
        setIsLoadingFiles(false);
      }
    };

    loadFiles();
  }, [client.documents]);

  const initialData: ClientFormType = {
    civility: client.civility,
    first_name: client.first_name,
    last_name: client.last_name,
    email: client.email || null,
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
      existingDocuments={existingDocuments}
      setExistingDocuments={setExistingDocuments}
      isLoading={!!isLoadingFiles}
    />
  );
}

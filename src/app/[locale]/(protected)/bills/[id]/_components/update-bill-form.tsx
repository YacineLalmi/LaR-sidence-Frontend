"use client";

import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Bill } from "@/schemas/bills/bill.schema";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState, useTransition } from "react";
import { BillForm as BillFormType } from "@/schemas/bills/bill-form.schema";
import BillForm from "../../_components/bill-form";
import { updateBillAction } from "@/actions/bills/update-bill.action";
import { getMediaAsBlobAction } from "@/actions/media/get-media.actions";
import { customToast } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  bill: Bill;
}

export default function UpdateBillForm({ bill }: Props) {
  const router = useRouter();
  const translation = useTranslations();

  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [existingDocuments, setExistingDocuments] = useState<File[]>([]);

  // Load existing files and convert them to File objects
  useEffect(() => {
    const loadFiles = async () => {
      console.log("setting true");
      setIsLoadingFiles(true);
      try {
        // Fetch documents
        const documentPromises = bill.documents?.map((doc) => getMediaAsBlobAction(doc)) || [];
        const documents = await Promise.all(documentPromises);
        console.log("setting false");
        setIsLoadingFiles(false);
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
        setIsLoadingFiles(false);
        customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.LOADING_FILE_FAILED));
      }
    };
    loadFiles();
  }, [bill.documents]);

  const initialData: BillFormType = {
    due_date: bill.due_date || new Date().toISOString(),
    client_id: bill.client?.id || "",
    bien_id: bill.bien?.id || "",
    status_id: bill.status?.id || "",
    services_description: bill.services_description || "",
    amount_ht: bill.amount_ht || "",
    amount_tva: bill.amount_tva || "",
    amount_ttc: bill.amount_ttc || "",
    billing_model_id: bill.billing_model?.id || "",
    new_documents: [],
    deleted_documents: [],
  };
  const onSuccess = useCallback(() => {
    router.push(ROUTES.BILLS.ROOT);
  }, [router]);

  console.log(isLoadingFiles);
  return (
    <BillForm
      initialData={initialData}
      submitAction={(values: BillFormType) => updateBillAction(values, bill.id)}
      successMessage={TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.UPDATED}
      errorMessage={TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.FAILED_UPDATE}
      formId="update-bill-form"
      successAction={onSuccess}
      existingDocuments={existingDocuments}
      setExistingDocuments={setExistingDocuments}
      areDocumentsLoading={isLoadingFiles}
    />
  );
}

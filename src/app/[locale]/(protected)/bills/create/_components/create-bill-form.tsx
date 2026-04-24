"use client";

import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { createBillAction } from "@/actions/bills/create-bill.action";
import { BillForm as BillFormType } from "@/schemas/bills/bill-form.schema";
import BillForm from "../../_components/bill-form";

export default function CreateBillForm() {
  const router = useRouter();

  const initialData: BillFormType = {
    due_date: new Date().toISOString(),
    client_id: "",
    bien_id: "",
    status_id: "",
    services_description: "",
    amount_ht: "",
    tax_amount: "",
    total_ttc: "",
    billing_model_id: "",
    payments: [],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
  };

  const onSuccess = useCallback(() => {
    router.push(ROUTES.BILLS.ROOT);
  }, [router]);

  return (
    <BillForm
      initialData={initialData}
      submitAction={createBillAction}
      successMessage={TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.CREATED}
      errorMessage={TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.FAILED_CREATION}
      formId="create-bill-form"
      successAction={onSuccess}
    />
  );
}

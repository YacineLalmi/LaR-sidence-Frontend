"use client";

import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Bill } from "@/schemas/bills/bill.schema";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { BillForm as BillFormType } from "@/schemas/bills/bill-form.schema";
import BillForm from "../../_components/bill-form";
import { updateBillAction } from "@/actions/bills/update-bill.action";

interface Props {
  bill: Bill;
}

export default function UpdateBillForm({ bill }: Props) {
  const router = useRouter();

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
    documents: [],
  };
  const onSuccess = useCallback(() => {
    router.push(ROUTES.BILLS.ROOT);
  }, [router]);

  return (
    <BillForm
      initialData={initialData}
      submitAction={(values: BillFormType) => updateBillAction(values, bill.id)}
      successMessage={TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.UPDATED}
      errorMessage={TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.FAILED_UPDATE}
      formId="update-bill-form"
      successAction={onSuccess}
    />
  );
}

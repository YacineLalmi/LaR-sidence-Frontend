"use client";

import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { BillingModelForm as BillingModelFormType } from "@/schemas/bills/models/billing-model-form.schema";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import BillingModelForm from "../../_components/billing-model-form";
import { createBillingModelAction } from "@/actions/bills/models/create-billing-model.action";
import { useTranslations } from "next-intl";
import { customToast } from "@/lib/utils";

export default function CreateBillingModelForm() {
  const router = useRouter();
  const translation = useTranslations();

  const initialData: BillingModelFormType = {
    name: "",
    tax_rate: "",
    bank_name: "",
    iban: "",
    swift_bic: "",
    footer: "",
    legal_mentions: "",
    logo: null,
  };

  const onSuccess = useCallback(() => {
    router.push(ROUTES.SETTINGS.BILLS.MODELS.ROOT);
    customToast.success(translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.CREATED));
  }, [router]);

  return (
    <BillingModelForm
      initialData={initialData}
      submitAction={createBillingModelAction}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.CREATED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.FAILED_CREATION}
      formId="create-billing-model-form"
      successAction={onSuccess}
    />
  );
}

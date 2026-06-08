"use client";

import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { BillingModelForm as BillingModelFormType } from "@/schemas/bills/models/billing-model-form.schema";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import BillingModelForm from "../../_components/billing-model-form";
import { updateBillingModelAction } from "@/actions/bills/models/update-billing-model.action";
import { customToast } from "@/lib/utils";
import { useTranslations } from "next-intl";

interface Props {
  billingModel: BillingModel;
}

export default function UpdateBillingModelForm({ billingModel }: Props) {
  const router = useRouter();
  const translation = useTranslations();

  // 1. Manage form values in state so we can update the logo once the blob is fetched
  const [formData, setFormData] = useState<BillingModelFormType>({
    name: billingModel.name,
    tax_rate: billingModel.tax_rate.toString(),
    bank_name: billingModel.bank_name,
    iban: billingModel.iban,
    swift_bic: billingModel.swift_bic,
    footer: billingModel.footer,
    legal_mentions: billingModel.legal_mentions,
    logo: billingModel.logo,
  });

  const onSuccess = useCallback(() => {
    router.push(ROUTES.SETTINGS.BILLS.MODELS.ROOT);
    customToast.success(translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.UPDATED));
  }, [router]);

  return (
    <BillingModelForm
      initialData={formData}
      key={formData.logo ? "ready" : "loading"}
      submitAction={async (values: BillingModelFormType) => await updateBillingModelAction(values, billingModel.id)}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.UPDATED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.FAILED_UPDATE}
      formId="update-billing-model-form"
      successAction={onSuccess}
    />
  );
}

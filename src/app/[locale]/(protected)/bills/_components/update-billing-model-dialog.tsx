"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import BillingModelForm from "../../settings/bills/models/_components/billing-model-form";
import { BillingModelForm as BillingModelFormType } from "@/schemas/bills/models/billing-model-form.schema";
import { createBillingModelAction } from "@/actions/bills/models/create-billing-model.action";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";
import { updateBillingModelAction } from "@/actions/bills/models/update-billing-model.action";

type UpdateBillingModelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBillingModelUpdated: (billingModel: BillingModel) => void;
  billingModel: BillingModel | undefined;
};

export default function UpdateBillingModelDialog({
  open,
  onOpenChange,
  onBillingModelUpdated,
  billingModel,
}: UpdateBillingModelDialogProps) {
  const translation = useTranslations();

  const initialData: BillingModelFormType = {
    name: billingModel?.name || "",
    tax_rate: billingModel?.tax_rate.toString() || "",
    bank_name: billingModel?.bank_name || "",
    iban: billingModel?.iban || "",
    swift_bic: billingModel?.swift_bic || "",
    footer: billingModel?.footer || "",
    legal_mentions: billingModel?.legal_mentions || "",
    logo: billingModel?.logo,
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-6xl max-h-[95vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.TITLES.UPDATE)}</DialogTitle>
        </DialogHeader>
        <BillingModelForm
          initialData={initialData}
          submitAction={(values: BillingModelFormType) => updateBillingModelAction(values, billingModel?.id || "")}
          successAction={onBillingModelUpdated}
          successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.UPDATED}
          errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.FAILED_CREATION}
        />
      </DialogContent>
    </Dialog>
  );
}

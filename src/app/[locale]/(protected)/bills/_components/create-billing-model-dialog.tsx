"use client";

import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import BillingModelForm from "../../settings/bills/models/_components/billing-model-form";
import { BillingModelForm as BillingModelFormType } from "@/schemas/bills/models/billing-model-form.schema";
import { createBillingModelAction } from "@/actions/bills/models/create-billing-model.action";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";

type CreateBillingModelDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onBillingModelCreated: (billingModel: BillingModel) => void;
};

export default function CreateBillingModelDialog({
  open,
  onOpenChange,
  onBillingModelCreated,
}: CreateBillingModelDialogProps) {
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!max-w-4xl max-h-[95vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>{translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.TITLES.CREATE)}</DialogTitle>
        </DialogHeader>
        <BillingModelForm
          initialData={initialData}
          submitAction={createBillingModelAction}
          successAction={onBillingModelCreated}
          successMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.CREATED}
          errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.FAILED_CREATION}
        />
      </DialogContent>
    </Dialog>
  );
}

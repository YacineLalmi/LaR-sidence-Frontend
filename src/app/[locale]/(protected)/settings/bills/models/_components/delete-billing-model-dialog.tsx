"use client";
import { deleteBillingModelAction } from "@/actions/bills/models/delete-billing-model.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  billingModel: BillingModel;
}
export default function DeleteBillingModelDialog({ billingModel }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.MESSAGES.DELETE_CONFIRMATION, { id: billingModel.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteBillingModelAction(billingModel.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.DEMANDS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.DEMANDS.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

"use client";

import { deleteBillAction } from "@/actions/bills/delete-bill.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Bill } from "@/schemas/bills/bill.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  bill: Bill;
}
export default function DeleteBillDialog({ bill }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.DELETE_CONFIRMATION, { id: bill.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteBillAction(bill.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.BILLS.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

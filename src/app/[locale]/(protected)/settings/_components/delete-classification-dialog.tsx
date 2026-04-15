"use client";

import { deleteClassificationAction } from "@/actions/classification/delete-classification.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Classification } from "@/schemas/classification/classification.schema";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  classification: Classification;
  category: string;
  scope: string;
  errorMessage?: string;
  successMessage?: string;
  confirmationMessage: string;
}

export default function DeleteClassificationDialog({
  classification,
  category,
  scope,
  confirmationMessage,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.DELETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.FAILED_DELETION,
}: Props) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={confirmationMessage}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteClassificationAction(category, scope, classification.id)}
      onSuccess={onSuccess}
      successMessage={successMessage}
      errorMessage={errorMessage}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

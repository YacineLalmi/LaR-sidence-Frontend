"use client";

import { deleteBienAction } from "@/actions/Bien/delete-bien.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Bien } from "@/schemas/biens/bien.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  bien: Bien;
}
export default function DeleteBienDialog({ bien }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.MESSAGES.DELETE_CONFIRMATION, { id: bien.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteBienAction(bien.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.BIENS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.BIENS.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0 size-7" />}
    />
  );
}

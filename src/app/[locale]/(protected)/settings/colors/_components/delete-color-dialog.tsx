"use client";

import { deleteColorAction } from "@/actions/colors/delete-color.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Color } from "@/schemas/colors/color.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  color: Color;
}

export default function DeleteColorDialog({ color }: Props) {
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);
  const translation = useTranslations();

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.DELETE_CONFIRMATION, { id: color.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteColorAction(color.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

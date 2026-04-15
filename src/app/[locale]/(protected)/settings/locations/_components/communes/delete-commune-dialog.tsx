"use client";

import { deleteCommuneAction } from "@/actions/commune/delete-commune.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Commune } from "@/schemas/communes/commune.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  commune: Commune;
}

export default function DeleteCommuneDialog({ commune }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.DELETE_TEXT, { id: commune.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteCommuneAction(commune.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.MESSAGES.FAILED_CREATION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

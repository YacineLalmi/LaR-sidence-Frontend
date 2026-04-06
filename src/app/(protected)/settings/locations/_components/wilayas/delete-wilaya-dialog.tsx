"use client";

import { deleteWilayaAction } from "@/actions/wilayas/delete-wilaya.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  wilaya: Wilaya;
}
export default function DeleteWilayaDialog({ wilaya }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.DELETE_TEXT, { id: wilaya.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteWilayaAction(wilaya.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

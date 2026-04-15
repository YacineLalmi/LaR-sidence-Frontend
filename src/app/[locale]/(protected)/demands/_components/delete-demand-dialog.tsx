"use client";
import { deleteDemandAction } from "@/actions/demands/delete-demand.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { Demand } from "@/schemas/demands/demand.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";

interface Props {
  demand: Demand;
}
export default function DeleteDemandDialog({ demand }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  const onSuccess = useCallback(() => {
    setIsDeleteOpen(false);
    router.refresh();
  }, []);

  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.MESSAGES.DELETE_CONFIRMATION, { id: demand.id })}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      confirmAction={() => deleteDemandAction(demand.id)}
      onSuccess={onSuccess}
      successMessage={TRANSLATIONS_KEYS_2.DEMANDS.FORM.MESSAGES.DELETED}
      errorMessage={TRANSLATIONS_KEYS_2.DEMANDS.FORM.MESSAGES.FAILED_DELETION}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

import { deleteBienTypeAction } from "@/actions/bien-types/delete.action";
import { deleteClientSourceAction } from "@/actions/client-sources/delete.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { customToast } from "@/lib/utils";
import { BienType } from "@/schemas/BienType.schema";
import { ClientSource } from "@/schemas/client-sources/client-source.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  clientSource: ClientSource;
}
export default function DeleteClientSourceDialog({ clientSource }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  async function onConfirm(id: number) {
    setIsPending(true);
    try {
      const response = await deleteClientSourceAction(id);
      setIsPending(false);
      if (response.isOk) {
        setIsDeleteOpen(false);
        router.refresh();
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    }
  }
  return (
    <DeleteConfirmationDialog
      title={translation(TRANSLATIONS_KEYS.SETTINGS.CLIENTS.SOURCES.DELETE_TEXT, { id: clientSource.id })}
      isPending={isPending}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      onConfirm={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onConfirm(clientSource.id);
      }}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

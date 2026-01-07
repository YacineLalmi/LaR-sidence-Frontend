"use client";

import { deleteWilayaAction } from "@/actions/wilayas/delete.action";
import CustomButton from "@/components/ui/custom-button";
import { DeleteConfirmationDialog } from "@/components/ui/delete-confirmation-dialog";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { customToast } from "@/lib/utils";
import { Commune } from "@/schemas/communes/commune.schema";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

interface Props {
  wilaya: Wilaya;
}
export default function DeleteWilayaDialog({ wilaya }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false);

  async function onConfirm(id: number) {
    setIsPending(true);
    try {
      const response = await deleteWilayaAction(id);
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
      title={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.DELETE_TEXT, { id: wilaya.id })}
      isPending={isPending}
      isOpen={isDeleteOpen}
      setIsOpen={setIsDeleteOpen}
      onConfirm={(e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        onConfirm(wilaya.id);
      }}
      trigger={<CustomButton Icon={Trash2} size="icon" variant="ghost" className="!p-0" />}
    />
  );
}

"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Edit } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { CommuneForm as CommuneFormType } from "@/schemas/communes/commune-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { Commune } from "@/schemas/communes/commune.schema";
import { updateCommuneAction } from "@/actions/commune/update-commune.action";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CommuneForm from "./commune-form";

const FORM_ID = "update-commune-form";

interface Props {
  wilayas: ListItem[];
  commune: Commune;
}

export default function EditCommuneDialog({ wilayas, commune }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const submitAction = useCallback(async (values: CommuneFormType) => {
    setIsPending(true);
    const response = await updateCommuneAction(values, commune.id);
    setIsPending(false);
    return response;
  }, []);

  const onSuccess = useCallback(() => {
    setIsOpen(false);
    router.refresh();
  }, [router]);

  const handleDialogOpen = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);

  return (
    <FormDialog
      formId={FORM_ID}
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY || "Save")}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.TITLES.EDIT)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />}
      preventOutsideClick={true}
    >
      <CommuneForm
        wilayas={wilayas}
        initialData={commune}
        submitAction={submitAction}
        successMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.UPDATED}
        errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.FAILED_UPDATE}
        formId={FORM_ID}
        successAction={onSuccess}
      />
    </FormDialog>
  );
}

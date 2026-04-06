"use client";

import { updateColorAction } from "@/actions/colors/update-color.action";
import { ColorForm as ColorFormType } from "@/schemas/colors/color-form.schema";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Edit } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { Color } from "@/schemas/colors/color.schema";
import ColorForm from "./color-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

const FORM_ID = "update-color-form";
interface Props {
  color: Color;
}

export default function UpdateColorDialog({ color }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const submitAction = async (values: ColorFormType) => {
    setIsPending(true);
    const response = await updateColorAction(values, color.id);
    setIsPending(false);
    return response;
  };

  const successAction = useCallback(() => {
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
      submitButtonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.TITLE.UPDATE)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />}
      preventOutsideClick={true}
    >
      <ColorForm
        initialData={color}
        submitAction={submitAction}
        successMessage={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.UPDATED)}
        errorMessage={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.FAILED_UPDATE)}
        formId={FORM_ID}
        successAction={successAction}
      />
    </FormDialog>
  );
}

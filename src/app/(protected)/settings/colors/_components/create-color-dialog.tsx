"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { ColorForm as ColorFormType } from "@/schemas/colors/color-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import ColorForm from "./color-form";
import { createColorAction } from "@/actions/colors/create-color.action";

const FORM_ID = "create-color-form";

export default function CreateColorDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const initialData: ColorFormType = {
    background_color: "#000000",
    text_color: "#ffffff",
    name: {
      fr: "",
      en: "",
      ar: "",
    },
    description: {
      fr: "",
      en: "",
      ar: "",
    },
  };

  const submitAction = useCallback(async (values: ColorFormType) => {
    setIsPending(true);
    const response = await createColorAction(values);
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
      submitButtonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.ADD)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.TITLE.CREATE)}
      trigger={<CustomButton text={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.BUTTONS.CREATE)} Icon={Plus} />}
      preventOutsideClick={true}
    >
      <ColorForm
        initialData={initialData}
        submitAction={submitAction}
        successMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.CREATED}
        errorMessage={TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.MESSAGES.FAILED_CREATION}
        formId={FORM_ID}
        successAction={onSuccess}
      />
    </FormDialog>
  );
}

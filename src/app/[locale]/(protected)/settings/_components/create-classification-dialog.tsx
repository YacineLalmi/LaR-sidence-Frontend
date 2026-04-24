"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Plus } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { ClassificationForm as ClassificationFormType } from "@/schemas/classification/classification-form.schema";
import { createClassificationAction } from "@/actions/classification/create-classification.action";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import ClassificationForm from "./classification-form";

const FORM_ID = "create-classification-form";

interface Props {
  category: string;
  scope: string;
  successMessage?: string;
  errorMessage?: string;
  title: string;
  buttonText: string;
}

export default function CreateClassificationDialog({
  category,
  scope,
  title,
  buttonText,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.CREATED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.FAILED_CREATION,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const initialData: ClassificationFormType = {
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
    is_active: true,
    code: "",
    color_id: null,
  };

  const submitAction = useCallback(async (values: ClassificationFormType) => {
    setIsPending(true);
    const response = await createClassificationAction(category, scope, values);
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
      title={translation(title)}
      trigger={<CustomButton text={translation(buttonText)} Icon={Plus} />}
      preventOutsideClick={true}
    >
      <ClassificationForm
        initialData={initialData}
        submitAction={submitAction}
        successMessage={successMessage}
        errorMessage={errorMessage}
        formId={FORM_ID}
        successAction={onSuccess}
      />
    </FormDialog>
  );
}

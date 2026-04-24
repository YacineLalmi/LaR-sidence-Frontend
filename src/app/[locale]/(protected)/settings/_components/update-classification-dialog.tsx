"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { Edit } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { ClassificationForm as ClassificationFormType } from "@/schemas/classification/classification-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ListItem } from "@/schemas/global.schema";
import ClassificationForm from "./classification-form";
import { Classification } from "@/schemas/classification/classification.schema";
import { updateClassificationAction } from "@/actions/classification/update-classification.action";

const FORM_ID = "update-classification-form";

interface Props {
  category: string;
  scope: string;
  successMessage?: string;
  errorMessage?: string;
  classification: Classification;
  title: string;
}

export default function UpdateClassificationDialog({
  category,
  scope,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.UPDATED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.FAILED_UPDATE,
  classification,
  title,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const initialData: ClassificationFormType = classification;

  const submitAction = useCallback(async (values: ClassificationFormType) => {
    setIsPending(true);
    const response = await updateClassificationAction(category, scope, values, classification.id);
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
      submitButtonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)}
      isPending={isPending}
      title={translation(title)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />}
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

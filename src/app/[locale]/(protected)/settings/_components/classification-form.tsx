"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import {
  ClassificationForm as ClassificationFormType,
  ClassificationFormSchema,
} from "@/schemas/classification/classification-form.schema";
import { createClassificationAction } from "@/actions/classification/create-classification.action";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ListItem } from "@/schemas/global.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { FormState } from "@/lib/definitions";

interface Props {
  initialData: ClassificationFormType;
  submitAction: (values: ClassificationFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: () => void;
  colors: ListItem[];
}

export default function ClassificationForm({
  initialData,
  submitAction,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED,
  formId,
  successAction,
  colors,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<ClassificationFormType>({
    resolver: zodResolver(ClassificationFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: ClassificationFormType) {
    setIsPending(true);
    try {
      const response = await submitAction(values);
      setIsPending(false);
      if (response.isOk) {
        successAction ? successAction() : router.refresh();
        customToast.success(translation(successMessage));
      } else customToast.error(response.errorMessage || translation(errorMessage));
    } catch (error) {
      customToast.error(translation(errorMessage));
    }
  }

  return (
    <Form {...form}>
      <form id={formId} onSubmit={form.handleSubmit(onSubmit)} className="grid gap-[12px]">
        {/* <InputTextField
          control={form.control}
          name="code"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.LABELS.CODE)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.PLACEHOLDERS.CODE)}
        /> */}
        <InputTextField
          control={form.control}
          name="name.fr"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.LABELS.NAME)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.PLACEHOLDERS.NAME)}
        />
        <InputTextField
          control={form.control}
          name="name.en"
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.PLACEHOLDERS.NAME)}
        />
        <InputTextField
          control={form.control}
          name="name.ar"
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.PLACEHOLDERS.NAME)}
        />
        <InputTextArea
          control={form.control}
          name="description.fr"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.LABELS.DESCRIPTION)}
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.PLACEHOLDERS.DESCRIPTION)}
        />
        <InputTextArea
          control={form.control}
          name="description.en"
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.PLACEHOLDERS.DESCRIPTION)}
        />
        <InputTextArea
          control={form.control}
          name="description.ar"
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.PLACEHOLDERS.DESCRIPTION)}
        />
        <InputSelectField
          control={form.control}
          name="color_id"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.LABELS.CODE)}
          disabled={isPending}
          options={colors}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BIENS.TYPES.FORM.PLACEHOLDERS.CODE)}
        />
      </form>
    </Form>
  );
}

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
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ListItem } from "@/schemas/global.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { FormState } from "@/lib/definitions";
import useFetch from "@/hooks/use-fetch.hook";
import { getColorsListAction } from "@/actions/colors/get-colors-list.action";

interface Props {
  initialData: ClassificationFormType;
  submitAction: (values: ClassificationFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: () => void;
}

export default function ClassificationForm({
  initialData,
  submitAction,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED,
  formId,
  successAction,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const [colors, isColorPending] = useFetch<ListItem[]>(() => getColorsListAction(), []);

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
        <InputTextField
          control={form.control}
          name="name.fr"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.LABELS.NAME.FR)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.PLACEHOLDERS.NAME.FR)}
        />
        <InputTextField
          control={form.control}
          name="name.en"
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.PLACEHOLDERS.NAME.EN)}
        />
        <InputTextField
          control={form.control}
          name="name.ar"
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.PLACEHOLDERS.NAME.AR)}
        />
        <InputTextArea
          control={form.control}
          name="description.fr"
          rows={2}
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.LABELS.DESCRIPTION.FR)}
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.PLACEHOLDERS.DESCRIPTION.FR)}
        />
        <InputTextArea
          control={form.control}
          name="description.en"
          rows={2}
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.PLACEHOLDERS.DESCRIPTION.EN)}
        />
        <InputTextArea
          control={form.control}
          name="description.ar"
          rows={2}
          disabled={isPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.PLACEHOLDERS.DESCRIPTION.AR)}
        />
        <InputSelectField
          control={form.control}
          name="color_id"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.LABELS.COLOR)}
          disabled={isPending}
          options={colors}
          isPending={isColorPending}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.CLASSIFICATIONS.FORM.PLACEHOLDERS.COLOR)}
        />
      </form>
    </Form>
  );
}

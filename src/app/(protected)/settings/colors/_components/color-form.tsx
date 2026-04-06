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
import { ColorForm as ColorFormType, ColorFormSchema } from "@/schemas/colors/color-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import InputColorField from "@/components/custom-inputs/input-color-field";

interface Props {
  initialData: ColorFormType;
  submitAction: (values: ColorFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: () => void;
}
export default function ColorForm({
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

  const form = useForm<ColorFormType>({
    resolver: zodResolver(ColorFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: ColorFormType) {
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
        <div className="grid grid-cols-2 gap-2">
          <InputColorField
            control={form.control}
            name="background_color"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.LABELS.BACKGROUND_COLOR)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.PLACEHOLDERS.BACKGROUND_COLOR)}
          />
          <InputColorField
            control={form.control}
            name="text_color"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.LABELS.TEXT_COLOR)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.PLACEHOLDERS.TEXT_COLOR)}
          />
        </div>
        <InputTextField
          control={form.control}
          name="name.fr"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.LABELS.NAME.FR)}
          disabled={isPending}
          required
          errorInside
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.PLACEHOLDERS.NAME.FR)}
        />
        <InputTextField
          control={form.control}
          name="name.en"
          disabled={isPending}
          required
          errorInside
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.PLACEHOLDERS.NAME.EN)}
        />
        <InputTextField
          control={form.control}
          name="name.ar"
          disabled={isPending}
          required
          errorInside
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.PLACEHOLDERS.NAME.AR)}
        />
        <InputTextArea
          control={form.control}
          name="description.fr"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.LABELS.DESCRIPTION.FR)}
          disabled={isPending}
          errorInside
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.PLACEHOLDERS.DESCRIPTION.FR)}
        />
        <InputTextArea
          control={form.control}
          name="description.en"
          disabled={isPending}
          errorInside
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.PLACEHOLDERS.DESCRIPTION.EN)}
        />
        <InputTextArea
          control={form.control}
          name="description.ar"
          disabled={isPending}
          errorInside
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.COLORS.FORM.PLACEHOLDERS.DESCRIPTION.AR)}
        />
      </form>
    </Form>
  );
}

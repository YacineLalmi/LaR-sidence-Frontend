"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { WilayaForm as WilayaFormType, WilayaFormSchema } from "@/schemas/wilayas/wilaya-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";

interface Props {
  initialData: WilayaFormType;
  submitAction: (values: WilayaFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: () => void;
}

export default function WilayaForm({
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

  const form = useForm<WilayaFormType>({
    resolver: zodResolver(WilayaFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: WilayaFormType) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 gap-3" id={formId}>
        <InputTextField
          control={form.control}
          name="code"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.LABELS.CODE)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.PLACEHOLDERS.CODE)}
        />
        <InputTextField
          control={form.control}
          name="name.fr"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.LABELS.NAME.FR)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.PLACEHOLDERS.NAME.FR)}
        />
        <InputTextField
          control={form.control}
          name="name.en"
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.PLACEHOLDERS.NAME.EN)}
        />
        <InputTextField
          control={form.control}
          name="name.ar"
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.WILAYAS.FORM.PLACEHOLDERS.NAME.AR)}
        />
      </form>
    </Form>
  );
}

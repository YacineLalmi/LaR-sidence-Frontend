"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { CommuneForm as CommuneFormType, CommuneFormSchema } from "@/schemas/communes/commune-form.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";

interface Props {
  wilayas: ListItem[];
  initialData: CommuneFormType;
  submitAction: (values: CommuneFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: () => void;
}
export default function CommuneForm({
  wilayas,
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

  const form = useForm<CommuneFormType>({
    resolver: zodResolver(CommuneFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: CommuneFormType) {
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-[12px]" id={formId}>
        <InputTextField
          control={form.control}
          name="post_code"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.LABELS.POST_CODE)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.PLACEHOLDERS.POST_CODE)}
        />
        <InputTextField
          control={form.control}
          name="name.fr"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.LABELS.NAME.FR)}
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.PLACEHOLDERS.NAME.FR)}
        />
        <InputTextField
          control={form.control}
          name="name.en"
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.PLACEHOLDERS.NAME.EN)}
        />
        <InputTextField
          control={form.control}
          name="name.ar"
          disabled={isPending}
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.PLACEHOLDERS.NAME.AR)}
        />
        <InputSelectField
          control={form.control}
          name="wilaya_id"
          label={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.LABELS.WILAYA_ID)}
          options={wilayas}
          placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.LOCATIONS.COMMUNES.FORM.PLACEHOLDERS.WILAYA_ID)}
          disabled={isPending}
          required
        />
      </form>
    </Form>
  );
}

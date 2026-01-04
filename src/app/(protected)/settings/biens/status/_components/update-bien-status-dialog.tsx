"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { BienStatusForm, BienStatusFormSchema } from "@/schemas/bien-status/bien-status-form.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { ListItem } from "@/schemas/Global.schema";
import { BienStatus } from "@/schemas/BienStatus.schema";
import { updateBienStatusAction } from "@/actions/bien-status/update.action";

interface Props {
  colors: ListItem[];
  bienStatus: BienStatus;
}

export default function UpdateBienStatusDialog({ colors, bienStatus }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<BienStatusForm>({
    resolver: zodResolver(BienStatusFormSchema),
    defaultValues: {
      code: bienStatus.code,
      name: bienStatus.name,
      description: bienStatus.description,
      color_id: bienStatus.color.id.toString(),
      is_active: bienStatus.is_active,
    },
  });

  async function onSubmit(values: BienStatusForm) {
    setIsPending(true);
    try {
      const response = await updateBienStatusAction(values, bienStatus.id);
      setIsPending(false);
      if (response.isOk) {
        setIsOpen(false);
        router.refresh();
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    }
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  const handleDialogOpen = useCallback((isOpen: boolean) => {
    setIsOpen(isOpen);
  }, []);

  return (
    <FormDialog
      formId="create-bien-status-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.APPLY)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.UPDATE)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />}
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form
          id="create-bien-status-form"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="grid gap-[12px]"
        >
          <InputTextField
            control={form.control}
            name="code"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.LABEL.CODE)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.LABEL.CODE)}
          />
          <InputTextField
            control={form.control}
            name="name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.LABEL.NAME)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.PLACEHOLDER.NAME)}
          />
          <InputTextArea
            control={form.control}
            name="description"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.LABEL.DESCRIPTION)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.PLACEHOLDER.DESCRIPTION)}
          />
          <InputSelectField
            control={form.control}
            name="color_id"
            options={colors}
            label={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.LABEL.COLOR_ID)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.STATUS.FORM.PLACEHOLDER.COLOR_ID)}
          />
        </form>
      </Form>
    </FormDialog>
  );
}

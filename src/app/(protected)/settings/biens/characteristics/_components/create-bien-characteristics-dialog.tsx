"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { createBienAdditionalCharacteristicsAction } from "@/actions/bien-additional-charactiristcs/create.action";
import {
  BienAdditionalcharacteristicsForm,
  BienAdditionalcharacteristicsFormSchema,
} from "@/schemas/bien-additional-characteristics/bien-additional-characteristics-form.schema";

export default function CreateBienCharacteristicsDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<BienAdditionalcharacteristicsForm>({
    resolver: zodResolver(BienAdditionalcharacteristicsFormSchema),
    defaultValues: {
      name: "",
      description: "",
      is_active: true,
    },
  });

  async function onSubmit(values: BienAdditionalcharacteristicsForm) {
    setIsPending(true);
    try {
      const response = await createBienAdditionalCharacteristicsAction(values);
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
      formId="create-bien-characteristics-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.ADD)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.FORM.ADD)}
      trigger={
        <CustomButton
          text={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.FORM.BUTTON_TEXT)}
          Icon={Plus}
        />
      }
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form
          id="create-bien-characteristics-form"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="grid gap-[12px]"
        >
          <InputTextField
            control={form.control}
            name="name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.FORM.LABEL.NAME)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.FORM.PLACEHOLDER.NAME)}
          />
          <InputTextArea
            control={form.control}
            name="description"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.FORM.LABEL.DESCRIPTION)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.BIENS.CHARACTERISTICS.FORM.PLACEHOLDER.DESCRIPTION)}
          />
        </form>
      </Form>
    </FormDialog>
  );
}

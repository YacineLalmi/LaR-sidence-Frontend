"use client";

import { createWilayaAction } from "@/actions/wilayas/create-wilaya.action";
import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { WilayaForm, WilayaFormSchema } from "@/schemas/wilayas/wilaya-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Plus } from "lucide-react";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

export default function CreateWilayaDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<WilayaForm>({
    resolver: zodResolver(WilayaFormSchema),
    defaultValues: {
      name: "",
      code: "",
    },
  });

  async function onSubmit(values: WilayaForm) {
    setIsPending(true);
    try {
      const response = await createWilayaAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.refresh();
        setIsOpen(false);
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
      formId="create-wilaya-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.ADD)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.FORM.ADD)}
      trigger={
        <CustomButton text={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.FORM.BUTTON_TEXT)} Icon={Plus} />
      }
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="grid grid-cols-1 gap-3"
          id="create-wilaya-form"
        >
          <InputTextField
            control={form.control}
            name="code"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.FORM.LABEL.CODE)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.FORM.PLACEHOLDER.CODE)}
          />
          <InputTextField
            control={form.control}
            name="name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.FORM.LABEL.NAME)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.FORM.PLACEHOLDER.NAME)}
          />
        </form>
      </Form>
    </FormDialog>
  );
}

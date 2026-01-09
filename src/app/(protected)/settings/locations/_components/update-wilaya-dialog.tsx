"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { WilayaForm, WilayaFormSchema } from "@/schemas/wilayas/wilaya-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Edit } from "lucide-react";
import { updateWilayaAction } from "@/actions/wilayas/update-wilaya.action";
import { Wilaya } from "@/schemas/wilayas/wilaya.schema";
import FormDialog from "@/components/form-dialog/form-dialog";
import CustomButton from "@/components/ui/custom-button";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  wilaya: Wilaya;
}

export default function UpdateWilayaDialog({ wilaya }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<WilayaForm>({
    resolver: zodResolver(WilayaFormSchema),
    defaultValues: {
      name: wilaya.name,
      code: wilaya.code,
    },
  });

  async function onSubmit(values: WilayaForm) {
    setIsPending(true);
    try {
      const response = await updateWilayaAction(values, wilaya.id);
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
      formId="update-wilaya-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.APPLY)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.FORM.UPDATE)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="p-0" />}
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="grid grid-cols-1 gap-3"
          id="update-wilaya-form"
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
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.WILAYAS.FORM.LABEL.NAME)}
          />
        </form>
      </Form>
    </FormDialog>
  );
}

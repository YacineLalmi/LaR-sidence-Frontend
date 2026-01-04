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
import { CommuneForm, CommuneFormSchema } from "@/schemas/communes/commune-form.schema";
import { createCommuneAction } from "@/actions/commune/create.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import { ListItem } from "@/schemas/Global.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  wilayas: ListItem[];
}
export default function CreateCommuneDialog({ wilayas }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<CommuneForm>({
    resolver: zodResolver(CommuneFormSchema),
    defaultValues: {
      wilaya_id: undefined,
      name: "",
      post_code: undefined,
    },
  });

  async function onSubmit(values: CommuneForm) {
    setIsPending(true);
    try {
      const response = await createCommuneAction(values);
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
      formId="create-commune-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.ADD)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.ADD)}
      trigger={
        <CustomButton text={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.BUTTON_TEXT)} Icon={Plus} />
      }
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="grid gap-[12px]" id="create-commune-form">
          <InputTextField
            control={form.control}
            name="name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.LABEL.NAME)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.PLACEHOLDER.NAME)}
          />
          <InputSelectField
            control={form.control}
            name="wilaya_id"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.LABEL.WILAYA_ID)}
            options={wilayas}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.PLACEHOLDER.WILAYA_ID)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="post_code"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.LABEL.CODE)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.PLACEHOLDER.CODE)}
          />
        </form>
      </Form>
    </FormDialog>
  );
}

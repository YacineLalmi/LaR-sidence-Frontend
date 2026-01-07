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
import { CommuneForm, CommuneFormSchema } from "@/schemas/communes/commune-form.schema";
import InputSelectField from "@/components/custom-inputs/input-select";
import { ListItem } from "@/schemas/global.schema";
import { Commune } from "@/schemas/communes/commune.schema";
import { updateCommuneAction } from "@/actions/commune/update.action";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  wilayas: ListItem[];
  commune: Commune;
}
export default function EditCommuneDialog({ wilayas, commune }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  console.log("Choosen commune", commune);
  const form = useForm<CommuneForm>({
    resolver: zodResolver(CommuneFormSchema),
    defaultValues: {
      wilaya_id: commune.wilaya.id.toString(),
      name: commune.name,
      post_code: commune.post_code.toString(),
    },
  });

  async function onSubmit(values: CommuneForm) {
    setIsPending(true);
    try {
      const response = await updateCommuneAction(values, commune.id);
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
      title={translation(TRANSLATIONS_KEYS.SETTINGS.LOCATIONS.COMMUNES.FORM.UPDATE)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />}
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

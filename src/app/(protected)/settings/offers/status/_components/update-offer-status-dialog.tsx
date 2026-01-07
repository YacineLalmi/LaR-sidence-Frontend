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
import InputSelectField from "@/components/custom-inputs/input-select";
import { ListItem } from "@/schemas/global.schema";
import { OfferStatus } from "@/schemas/offer-status/offer-status.schema";
import { OfferStatusForm, OfferStatusFormSchema } from "@/schemas/offer-status/offer-status-form.schema";
import { updateOfferStatusAction } from "@/actions/offer-status/update.action";

interface Props {
  colors: ListItem[];
  offerStatus: OfferStatus;
}

export default function UpdateOfferStatusDialog({ colors, offerStatus }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<OfferStatusForm>({
    resolver: zodResolver(OfferStatusFormSchema),
    defaultValues: {
      name: offerStatus.name,
      description: offerStatus.description,
      color_id: offerStatus.color.id.toString(),
      is_active: offerStatus.is_active,
    },
  });

  async function onSubmit(values: OfferStatusForm) {
    setIsPending(true);
    try {
      const response = await updateOfferStatusAction(values, offerStatus.id);
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
      formId="update-offer-status-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.APPLY)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.FORM.UPDATE)}
      trigger={<CustomButton Icon={Edit} size="icon" variant="ghost" className="!p-0" />}
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form
          id="update-offer-status-form"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="grid gap-[12px]"
        >
          <InputTextField
            control={form.control}
            name="name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.FORM.LABEL.NAME)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.FORM.PLACEHOLDER.NAME)}
          />
          <InputSelectField
            control={form.control}
            name="color_id"
            options={colors}
            label={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.FORM.LABEL.COLOR_ID)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.FORM.PLACEHOLDER.COLOR_ID)}
          />
          <InputTextArea
            control={form.control}
            name="description"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.FORM.LABEL.DESCRIPTION)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.OFFERS.STATUS.FORM.PLACEHOLDER.DESCRIPTION)}
          />
        </form>
      </Form>
    </FormDialog>
  );
}

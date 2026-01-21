"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
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
import { Input } from "@/components/ui/input";
import { ColorForm, ColorFormSchema } from "@/schemas/colors/color-form.schema";
import { createColorAction } from "@/actions/colors/create.action";

export default function CreateColorDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<ColorForm>({
    resolver: zodResolver(ColorFormSchema),
    defaultValues: {
      background_color: "#000000",
      text_color: "#ffffff",
      name: "",
      description: "",
    },
  });

  async function onSubmit(values: ColorForm) {
    
    setIsPending(true);
    try {
      const response = await createColorAction(values);
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
      formId="create-color-type-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.ADD)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.ADD)}
      trigger={<CustomButton text={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.BUTTON_TEXT)} Icon={Plus} />}
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form id="create-color-type-form" onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="grid gap-[12px]">
          <div className="grid grid-cols-2 gap-2">
            <InputTextField
              control={form.control}
              name="background_color"
              label={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.LABEL.BACKGROUND_COLOR)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.PLACEHOLDER.BACKGROUND_COLOR)}
            />
            <FormField
              control={form.control}
              name="background_color"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.LABEL.BACKGROUND_COLOR)}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative ">
                      <Input required disabled={isPending} type="color" {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <InputTextField
              control={form.control}
              name="text_color"
              label={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.LABEL.TEXT_COLOR)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.PLACEHOLDER.TEXT_COLOR)}
            />
            <FormField
              control={form.control}
              name="text_color"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>
                    {translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.LABEL.TEXT_COLOR)}
                    <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <div className="relative ">
                      <Input disabled={isPending} type="color" {...field} />
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <InputTextField
            control={form.control}
            name="name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.LABEL.NAME)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.PLACEHOLDER.NAME)}
          />
          <InputTextArea
            control={form.control}
            name="description"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.LABEL.DESCRIPTION)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.COLORS.FORM.PLACEHOLDER.DESCRIPTION)}
          />
        </form>
      </Form>
    </FormDialog>
  );
}

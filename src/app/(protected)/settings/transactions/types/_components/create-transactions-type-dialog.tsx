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
import {
  TransactionTypeForm,
  TransactionTypeFormSchema,
} from "@/schemas/transaction-type/transaction-type-form.schema";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { createTransactionTypeAction } from "@/actions/transaction-type/create.action";

export default function CreateTransactionTypeDialog() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const form = useForm<TransactionTypeForm>({
    resolver: zodResolver(TransactionTypeFormSchema),
    defaultValues: {
      code: "",
      name: "",
      description: "",
      is_active: true,
    },
  });

  async function onSubmit(values: TransactionTypeForm) {
    setIsPending(true);
    try {
      const response = await createTransactionTypeAction(values);
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
      formId="create-transaction-type-form"
      isOpen={isOpen}
      onOpenChange={handleDialogOpen}
      submitButtonText={translation(TRANSLATIONS_KEYS.COMMON.ADD)}
      isPending={isPending}
      title={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.FORM.ADD)}
      trigger={
        <CustomButton text={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.FORM.BUTTON_TEXT)} Icon={Plus} />
      }
      preventOutsideClick={true}
    >
      <Form {...form}>
        <form
          id="create-transaction-type-form"
          onSubmit={form.handleSubmit(onSubmit, onInvalid)}
          className="grid gap-[12px]"
        >
          <InputTextField
            control={form.control}
            name="code"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.FORM.LABEL.CODE)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.FORM.PLACEHOLDER.CODE)}
          />
          <InputTextField
            control={form.control}
            name="name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.FORM.LABEL.NAME)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.FORM.PLACEHOLDER.NAME)}
          />
          <InputTextArea
            control={form.control}
            name="description"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.FORM.LABEL.DESCRIPTION)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.TRANSACTIONS.TYPES.FORM.PLACEHOLDER.DESCRIPTION)}
          />
        </form>
      </Form>
    </FormDialog>
  );
}

"use client";

import { createUserAction } from "@/actions/users/create-user.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputSwitch from "@/components/custom-inputs/input-switch";
import InputTextField from "@/components/custom-inputs/input-text";
import MirageLoader from "@/components/mirage-loader";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { UserForm as UserFormType, UserFormSchema } from "@/schemas/users/user-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  roles: ListItem[];
  status: ListItem[];
  initialData: UserFormType;
  submitAction: (values: UserFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  successAction?: () => void;
  submitButtonText?: string;
}

export default function UserForm({
  roles,
  initialData,
  submitAction,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED,
  successAction,
  status,
  submitButtonText = TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<UserFormType>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: initialData,
    mode: "onTouched",
  });

  async function onSubmit(values: UserFormType) {
    setIsPending(true);
    try {
      const response = await submitAction(values);
      setIsPending(false);
      if (response.isOk) {
        successAction ? successAction() : router.push(ROUTES.SETTINGS.USERS.ROOT);
        customToast.success(translation(successMessage));
      } else customToast.error(response.errorMessage || translation(errorMessage));
    } catch (error) {
      customToast.error(translation(errorMessage));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-1 gap-3">
          <InputTextField
            control={form.control}
            name="first_name"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.LABELS.FIRST_NAME)}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.PLACEHOLDERS.FIRST_NAME)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="last_name"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.LABELS.LAST_NAME)}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.PLACEHOLDERS.LAST_NAME)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="username"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.LABELS.USERNAME)}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.PLACEHOLDERS.USERNAME)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="phonenumber"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.LABELS.PHONE_NUMBER)}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.PLACEHOLDERS.PHONE_NUMBER)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="email"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.LABELS.EMAIL)}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.PLACEHOLDERS.EMAIL)}
            disabled={isPending}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-3 content-baseline">
          <InputSelectField
            control={form.control}
            name="role_id"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.LABELS.ROLE)}
            options={roles}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.PLACEHOLDERS.ROLE)}
            disabled={isPending}
            required
          />
          {/* <InputSelectField
            control={form.control}
            name="is_active"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.LABELS.STATUS)}
            options={status}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.PLACEHOLDERS.STATUS)}
            disabled={isPending}
            required
          /> */}
          <InputSwitch
            control={form.control}
            name="is_active"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FORM.LABELS.STATUS)}
            disabled={isPending}
            required
          />
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {isPending ? <MirageLoader /> : translation(submitButtonText)}
        </Button>
      </form>
    </Form>
  );
}

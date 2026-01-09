"use client";

import { createUserAction } from "@/actions/users/create-user.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { UserForm, UserFormSchema } from "@/schemas/users/user-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  roles: ListItem[];
}

export default function CreateUserForm({ roles }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const status: ListItem[] = [
    {
      id: "1",
      name: "active",
    },
    {
      id: "0",
      name: "inactive",
    },
  ];

  const form = useForm<UserForm>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: "",
      username: "",
      first_name: "",
      last_name: "",
      phonenumber: "",
      role_id: undefined,
      is_active: undefined,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UserForm) {
    setIsPending(true);
    try {
      const response = await createUserAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push(NAVIGATION_KEYS.SETTINGS.USERS.ROOT);
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

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-1 gap-3">
          <InputTextField
            control={form.control}
            name="first_name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.LABEL.FIRST_NAME)}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.PLACEHOLDER.FIRST_NAME)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="last_name"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.LABEL.LAST_NAME)}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.PLACEHOLDER.LAST_NAME)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="username"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.LABEL.USERNAME)}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.PLACEHOLDER.USERNAME)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="phonenumber"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.LABEL.PHONENUMBER)}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.PLACEHOLDER.PHONENUMBER)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="email"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.LABEL.EMAIL)}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.PLACEHOLDER.EMAIL)}
            disabled={isPending}
            required
          />
        </div>
        <div className="grid grid-cols-1 gap-3 content-baseline">
          <InputSelectField
            control={form.control}
            name="role_id"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.LABEL.ROLE)}
            options={roles}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.PLACEHOLDER.ROLE)}
            disabled={isPending}
            required
          />
          <InputSelectField
            control={form.control}
            name="is_active"
            label={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.LABEL.STATUS)}
            options={status}
            placeholder={translation(TRANSLATIONS_KEYS.SETTINGS.USERS.FORM.PLACEHOLDER.STATUS)}
            disabled={isPending}
            required
          />
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {translation(TRANSLATIONS_KEYS.COMMON.SUBMIT)}
        </Button>
      </form>
    </Form>
  );
}

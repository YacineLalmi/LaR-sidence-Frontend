"use client";

import { createUserAction } from "@/actions/users/create-user.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
  const t = useTranslations();

  const form = useForm<UserForm>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: "",
      first_name: "",
      last_name: "",
      username: "",
      role_id: undefined,
      is_active: false,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UserForm) {
    setIsPending(true);
    try {
      const response = await createUserAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/users");
        customToast.success(t("settings.users.form.created"));
      } else customToast.error(response.errorMessage || t("settings.users.form.failedCreation"));
    } catch (error) {
      customToast.error(t("settings.users.form.failedCreation"));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid grid-cols-3 gap-3">
        <InputTextField
          control={form.control}
          name="first_name"
          label={t("settings.users.form.label.firstName")}
          disabled={isPending}
          required
          placeholder={t("settings.users.form.placeholder.firstName")}
        />
        <InputTextField
          control={form.control}
          name="last_name"
          label={t("settings.users.form.label.lastName")}
          disabled={isPending}
          required
          placeholder={t("settings.users.form.placeholder.lastName")}
        />
        <InputSelectField
          control={form.control}
          name="role_id"
          options={roles}
          disabled={isPending}
          required
          label={t("settings.users.form.label.roles")}
          placeholder={t("settings.users.form.placeholder.roles")}
        />
        <div className="col-span-3 grid grid-cols-2 gap-3">
          <InputTextField
            control={form.control}
            name="username"
            label={t("settings.users.form.label.username")}
            disabled={isPending}
            required
            placeholder={t("settings.users.form.placeholder.username")}
          />
          <InputTextField
            control={form.control}
            name="email"
            label={t("settings.users.form.label.email")}
            disabled={isPending}
            required
            placeholder={t("settings.users.form.placeholder.email")}
          />
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}

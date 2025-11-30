"use client";

import { createUserAction } from "@/actions/users/create-user.action";
import { updateUserAction } from "@/actions/users/update.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputSwitch from "@/components/custom-inputs/input-switch";
import InputTextField from "@/components/custom-inputs/input-text";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/Global.schema";
import { UserDetails } from "@/schemas/users/user-details.schema";
import { UserForm, UserFormSchema } from "@/schemas/users/user-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  user: UserDetails;
  roles: ListItem[];
}

export default function UpdateUserForm({ roles, user }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const t = useTranslations();

  const form = useForm<UserForm>({
    resolver: zodResolver(UserFormSchema),
    defaultValues: {
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      username: user.username,
      role_id: user.role.id,
      is_active: user.is_active,
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: UserForm) {
    setIsPending(true);
    try {
      const response = await updateUserAction(user.id, values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/users");
        customToast.success(t("users.create.success"));
      } else customToast.error(response.errorMessage || t("users.create.failed"));
    } catch (error) {
      customToast.error(t("users.create.failed"));
    }
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid grid-cols-3 gap-3">
          <InputTextField
            control={form.control}
            name="first_name"
            label={t("users.create.label.firstName")}
            disabled={isPending}
            required
            placeholder={t("users.create.placeholder.firstName")}
          />
          <InputTextField
            control={form.control}
            name="last_name"
            label={t("users.create.label.lastName")}
            disabled={isPending}
            required
            placeholder={t("users.create.placeholder.lastName")}
          />
          <InputSelectField
            control={form.control}
            name="role_id"
            options={roles}
            disabled={isPending}
            required
            label={t("users.create.label.roles")}
            placeholder={t("users.create.placeholder.roles")}
          />
          <InputTextField
            control={form.control}
            name="username"
            label={t("users.create.label.username")}
            disabled={isPending}
            required
            placeholder={t("users.create.placeholder.username")}
          />
          <InputTextField
            control={form.control}
            name="email"
            label={t("users.create.label.email")}
            disabled={isPending}
            required
            placeholder={t("users.create.placeholder.email")}
          />
          <InputSwitch
            control={form.control}
            name="is_active"
            label={t("users.create.label.isActive")}
            disabled={isPending}
            required
          />
          <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
            {t("common.submit")}
          </Button>
        </form>
      </Form>
    </>
  );
}

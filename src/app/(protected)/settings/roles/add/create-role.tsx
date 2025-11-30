"use client";

import { createRoleAction } from "@/actions/roles/create-role.action";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Toggle } from "@/components/ui/toggle";
import { customToast } from "@/lib/utils";
import { PermissionCategory } from "@/schemas/permissions/permissions.schema";
import { RoleForm, RoleFormSchema } from "@/schemas/roles/role-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  permissionCategories: PermissionCategory[];
}

export default function CreateRoleForm({ permissionCategories }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [rolePermissions, setRolePermissions] = useState<number[]>([]);

  const router = useRouter();
  const t = useTranslations();

  const form = useForm<RoleForm>({
    resolver: zodResolver(RoleFormSchema),
    defaultValues: {
      name: "",
      display_name: "",
      description: "",
      permissions: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: RoleForm) {
    setIsPending(true);
    try {
      const response = await createRoleAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push("/settings/roles");
        customToast.success(t("users.create.success"));
      } else customToast.error(response.errorMessage || t("users.create.failed"));
    } catch (error) {
      customToast.error(t("users.create.failed"));
    }
  }

  const hasPermission = useCallback(
    (id: number) => {
      return rolePermissions.includes(id);
    },
    [form, rolePermissions]
  );

  const togglePermission = useCallback(
    (id: number) => {
      if (rolePermissions.includes(id)) {
        setRolePermissions((prev) => prev.filter((permissionId) => permissionId !== id));
      } else setRolePermissions((prev) => [...prev, id]);
    },
    [form]
  );

  useEffect(() => {
    form.setValue("permissions", rolePermissions);
  }, [rolePermissions, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
        <InputTextField
          control={form.control}
          name="name"
          label={t("roles.form.labels.name")}
          placeholder={t("roles.form.placeholders.name")}
          required
          disabled={isPending}
        />
        <InputTextField
          control={form.control}
          name="display_name"
          label={t("roles.form.labels.displayName")}
          placeholder={t("roles.form.placeholders.displayName")}
          required
          disabled={isPending}
        />
        <div className="col-span-2">
          <InputTextArea
            control={form.control}
            name="description"
            className="col-span-2"
            label={t("roles.form.labels.description")}
            placeholder={t("roles.form.placeholders.description")}
            required
            disabled={isPending}
          />
        </div>
        {/* <input hidden value={}/> */}
        <div className="flex- flex-col gap-2 col-span-2">
          <h1 className="font-bold text-xl">Permissions Management</h1>
          {permissionCategories.length > 0 &&
            permissionCategories.map((category) => (
              <div key={category.name} className="flex w-full mt-2">
                <div className="w-1/4">{category.name}</div>
                <div className="flex gap-2 justify-start">
                  {category.permissions.map((permission) => (
                    <Toggle
                      key={permission.id}
                      pressed={hasPermission(permission.id)}
                      onPressedChange={() => togglePermission(permission.id)}
                      aria-label={`Toggle ${permission.display_name}`}
                      className="w-44 border-1 bg-none border-black text-black data-[state=on]:bg-amber-100 data-[state=on]:border-amber-700  hover:bg-amber-100 transition-all duration-200 cursor-pointer"
                    >
                      {permission.display_name}
                    </Toggle>
                  ))}
                </div>
              </div>
            ))}
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {t("common.submit")}
        </Button>
      </form>
    </Form>
  );
}

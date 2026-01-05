"use client";

import { getRolesList } from "@/actions/roles/get-roles-list.action";
import { InputRangeField } from "@/components/custom-inputs/input-range";
import InputSelectField from "@/components/custom-inputs/input-select";
import { Button } from "@/components/ui/button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { loadOptions, parseDateRange } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { UserFilterForm, UserFilterFormSchema } from "@/schemas/users/user-filter-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function UsersFilters() {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [roles, setRoles] = useState<ListItem[]>([]);

  const statusOptions: ListItem[] = [
    {
      id: "1",
      name: "Activé",
    },
    {
      id: "0",
      name: "Désactivé",
    },
    {
      id: "2",
      name: "Désactivé",
    },
  ];

  const searchParams = useSearchParams();

  const router = useRouter();
  const form = useForm<UserFilterForm>({
    resolver: zodResolver(UserFilterFormSchema),
    defaultValues: {
      role_id: undefined,
      is_active: undefined,
      created_between: {
        from: undefined,
        to: undefined,
      },
    },
  });

  function onSubmit(values: UserFilterForm) {
    const params = new URLSearchParams();
    if (values.role_id && values.role_id !== "0") params.append("role_id", values.role_id);
    if (values.is_active && values.is_active !== "2") params.append("is_active", values.is_active);
    if (values.created_between?.from && values.created_between.to) {
      params.append(
        "created_between",
        `${format(values.created_between.from || new Date(), "P")},${format(
          values.created_between.to || new Date(),
          "P"
        )}`
      );
    }

    router.push(`?${params.toString()}`);
    setIsOpen(false);
  }

  const handleClearFilters = useCallback(() => {
    console.log("clearing filters");
    const params = new URLSearchParams();
    params.delete("role_id");
    params.delete("is_active");
    params.append("created_between", "");
    router.push(`?${params.toString()}`);
    setIsOpen(false);
    console.log("cleared");
  }, [router, setIsOpen]);

  const t = useTranslations();

  useEffect(() => {
    if (isOpen) {
      getRolesList().then((data) => {
        console.log("Rolllles", data);

        setRoles([{ id: "0", name: "all" }, ...data]);
        form.setValue("role_id", searchParams.get("role_id") || undefined);
      });

      if (searchParams.has("role_id")) {
        form.setValue("role_id", searchParams.get("role_id") as string);
      }

      if (searchParams.has("is_active")) {
        form.setValue("is_active", searchParams.get("is_active") as string);
      }

      if (searchParams.has("created_between")) {
        form.setValue("created_between", parseDateRange(searchParams.get("created_between")));
      }
    }

    return () => {
      setRoles([]);
      form.reset();
    };
  }, [form, isOpen, searchParams]);

  return (
    <FilterDrawer
      buttonText={t("common.filter")}
      title={t("settings.users.filter.title")}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="role_id"
            label={t("settings.users.filter.label.role")}
            options={roles}
            placeholder={t("settings.users.filter.placeholder.role")}
          />
          <InputSelectField
            control={form.control}
            name="is_active"
            label={t("settings.users.filter.label.status")}
            options={statusOptions}
            placeholder={t("settings.users.filter.placeholder.status")}
          />
          <div className=" flex gap-1 w-full">
            <InputRangeField
              control={form.control}
              name="created_between"
              label={t("settings.users.filter.label.createdBetween")}
              placeholder={t("settings.users.filter.placeholder.createdBetween")}
            />
          </div>
          <Button type="submit" className="w-full mt-5">
            {t("common.apply")}
          </Button>
          <Button className="w-full hover:bg-amber-200 cursor-pointer" variant="secondary" onClick={handleClearFilters}>
            {t("common.clearFilters")}
          </Button>
        </form>
      </Form>
    </FilterDrawer>
  );
}

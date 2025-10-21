"use client";

import { InputRangeField } from "@/components/custom-inputs/input-range";
import InputSelectField from "@/components/custom-inputs/input-select";
import { Button } from "@/components/ui/button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { loadOptions, parseDateRange } from "@/lib/utils";
import { ListItem } from "@/schemas/Global.schema";
import { UserFilterForm, UserFilterFormSchema } from "@/schemas/users/user-filter-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
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

  //   console.log(form.watch("wilaya_id"));
  //   const loadOptions = useCallback(async (optionsEndPoint: string): Promise<ListItem[]> => {
  //     try {
  //       return await fetch(optionsEndPoint, { cache: "force-cache", next: { revalidate: 300 } }).then((res) =>
  //         res.json()
  //       );
  //     } catch (error) {
  //       console.error("erroorrrrr", error);
  //     }
  //     return [];
  //   }, []);
  async function onSubmit(values: UserFilterForm) {
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
  const t = useTranslations();

  useEffect(() => {
    loadOptions("/api/lists/roles").then((data) => {
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

    return () => {
      setRoles([]);
      form.reset();
    };
  }, [form]);
  return (
    <FilterDrawer buttonText={t("global.filter")} title={t("biens.filter.title")} isOpen={isOpen} setIsOpen={setIsOpen}>
      <Form {...form}>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="role_id"
            label={t("users.filter.label.role")}
            options={roles}
            placeholder={t("users.filter.placeholder.role")}
          />
          <InputSelectField
            control={form.control}
            name="is_active"
            label={t("users.filter.label.status")}
            options={statusOptions}
            placeholder={t("users.filter.placeholder.status")}
          />
          <div className=" flex gap-1 w-full">
            <InputRangeField
              control={form.control}
              name="created_between"
              label={t("users.filter.label.createdBetween")}
              placeholder={t("users.filter.placeholder.createdBetween")}
            />
          </div>
          <Button type="submit" className="w-full mt-5">
            {t("global.apply")}
          </Button>
        </form>
      </Form>
    </FilterDrawer>
  );
}

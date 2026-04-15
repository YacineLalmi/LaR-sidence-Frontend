"use client";

import InputSelectField from "@/components/custom-inputs/input-select";
import CustomButton from "@/components/ui/custom-button";
import FilterDrawer from "@/components/ui/filter-drawer";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ListItem } from "@/schemas/global.schema";
import { UserFilterForm, UserFilterFormSchema } from "@/schemas/users/user-filter-form.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  roles: ListItem[];
}
export default function UsersFilters({ roles }: Props) {
  const [isOpen, setIsOpen] = useState<boolean>(false);

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
      name: "Tous",
    },
  ];

  const searchParams = useSearchParams();

  const router = useRouter();
  const form = useForm<UserFilterForm>({
    resolver: zodResolver(UserFilterFormSchema),
    defaultValues: {
      role_id: undefined,
      is_active: undefined,
    },
  });

  function onSubmit(values: UserFilterForm) {
    const params = new URLSearchParams();
    if (values.role_id && values.role_id !== "0") params.append("role_id", values.role_id);
    if (values.is_active && values.is_active !== "2") params.append("is_active", values.is_active);

    router.push(`?${params.toString()}`);
    setIsOpen(false);
  }

  const handleClearFilters = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      const params = new URLSearchParams(searchParams.toString());
      params.delete("role_id");
      params.delete("is_active");
      router.push(`?${params.toString()}`);
      setIsOpen(false);
    },
    [router, setIsOpen],
  );

  const translation = useTranslations();

  useEffect(() => {
    if (isOpen) {
      form.setValue("role_id", searchParams.get("role_id") || undefined);
      form.setValue("is_active", searchParams.get("is_active") || undefined);
    }

    return () => {
      form.reset();
    };
  }, [form, isOpen, searchParams]);

  return (
    <FilterDrawer
      buttonText={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.FILTER)}
      title={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FILTER.TITLE)}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
    >
      <Form {...form}>
        <form id="login-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-2 p-5">
          <InputSelectField
            control={form.control}
            name="role_id"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FILTER.LABELS.ROLE)}
            options={roles}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FILTER.PLACEHOLDERS.ROLE)}
          />
          <InputSelectField
            control={form.control}
            name="is_active"
            label={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FILTER.LABELS.STATUS)}
            options={statusOptions}
            placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.USERS.FILTER.PLACEHOLDERS.STATUS)}
          />
          <CustomButton
            type="submit"
            text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)}
            className="w-full mt-5"
          />
          <CustomButton
            onClick={handleClearFilters}
            type="button"
            variant="ghost"
            text={translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.CLEAR_FILTERS)}
            className="w-full"
          />
        </form>
      </Form>
    </FilterDrawer>
  );
}

"use client";

import { SearchForm, SearchFormSchema } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Form } from "./form";
import { Search } from "lucide-react";
import InputTextField from "../custom-inputs/input-text";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  prefix?: string;
}
export default function SearchField({ prefix = "" }: Props) {
  const translation = useTranslations();
  const router = useRouter();
  const form = useForm<SearchForm>({
    resolver: zodResolver(SearchFormSchema),
    defaultValues: {
      search: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: SearchForm) {
    const params = new URLSearchParams(window.location.search);
    if (values.search) params.set(`${prefix ? prefix + "_search" : "search"}`, values.search);
    else params.delete(`${prefix ? prefix + "_search" : "search"}`);

    router.push(`?${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-2/3 gap-2">
        <InputTextField
          control={form.control}
          name="search"
          required
          placeholder={translation(TRANSLATIONS_KEYS_2.COMMON.SEARCH.PLACEHOLDER)}
          LeftIcon={Search}
          className="py-6"
        />
      </form>
    </Form>
  );
}

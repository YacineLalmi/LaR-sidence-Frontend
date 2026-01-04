"use client";

import { SearchForm, SearchFormSchema } from "@/schemas/Global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "./form";
import { Search } from "lucide-react";
import InputTextField from "../custom-inputs/input-text";

interface Props {
  prefix?: string;
}
export default function SearchField({ prefix = "" }: Props) {
  const t = useTranslations("common.search");
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
    params.set("search", values.search);
    router.push(`?${prefix}_${params.toString()}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex w-2/3 gap-2">
        <InputTextField
          control={form.control}
          name="search"
          required
          placeholder={t("placeholder")}
          LeftIcon={Search}
          className="py-6"
        />
      </form>
    </Form>
  );
}

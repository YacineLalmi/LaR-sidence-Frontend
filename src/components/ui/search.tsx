import { SearchForm, SearchFormSchema } from "@/schemas/Global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm } from "react-hook-form";
import { Form } from "./form";
import { Button } from "./button";
import { Search } from "lucide-react";
import InputTextField from "../custom-inputs/input-text";

export default function SearchField() {
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
    router.push(`?${params.toString()}`);
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
        <Button
          className="flex gap-2 p-6 rounded-4xl bg-transparent border-gray-600 cursor-pointer hover:bg-amber-200"
          variant="outline"
          type="submit"
        >
          {t("button")}
          <Search />
        </Button>
      </form>
    </Form>
  );
}

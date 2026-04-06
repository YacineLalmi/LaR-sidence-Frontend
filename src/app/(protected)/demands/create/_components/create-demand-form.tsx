"use client";

import { createDemandAction } from "@/actions/demands/create-demand.action";
import Section from "@/app/(protected)/biens/[id]/_components/section";
import { InputSearchField } from "@/components/custom-inputs/input-search";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { DemandForm, DemandFormSchema } from "@/schemas/demands/demand-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  types: ListItem[];
  status: ListItem[];
  priorities: ListItem[];
  sources: ListItem[];
  clients: ListItem[];
  biens: ListItem[];
  agents: ListItem[];
}

export default function CreateDemandForm({ types, status, priorities, sources, clients, biens, agents }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<DemandForm>({
    resolver: zodResolver(DemandFormSchema),
    defaultValues: {
      // title: "",
      type_id: "",
      client_id: "",
      source_id: "",
      bien_id: "",
      agent_id: "",
      status_id: "",
      priority_id: "",
      budget: "",
      comment: "",
    },
  });

  async function onSubmit(values: DemandForm) {
    setIsPending(true);
    try {
      const response = await createDemandAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push(ROUTES.DEMANDS.ROOT);
        customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
      } else
        customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    }
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    // customToast.error(`${field}: ${error.message}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-1 gap-3">
          <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.GENERAL_INFORMATION)}>
            {/* <InputTextField
              control={form.control}
              name="title"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.TITLE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.TITLE)}
            /> */}
            <InputSelectField
              control={form.control}
              name="type_id"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.TYPE)}
              options={types}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.TYPE)}
              disabled={isPending}
              required
            />
            <InputSearchField
              control={form.control}
              name="client_id"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.CLIENT)}
              disabled={isPending}
              required
              options={clients}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.CLIENT)}
            />
            <InputSearchField
              control={form.control}
              name="bien_id"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.BIEN)}
              disabled={isPending}
              required
              options={biens}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.BIEN)}
            />
            <InputSelectField
              control={form.control}
              name="status_id"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.STATUS)}
              options={status}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.STATUS)}
              disabled={isPending}
              required
            />
            <InputTextField
              control={form.control}
              name="budget"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.BUDGET)}
              disabled={isPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.BUDGET)}
            />
          </Section>
        </div>
        <div className="grid grid-cols-1 gap-3 content-start my-3">
          <InputSelectField
            control={form.control}
            name="priority_id"
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.PRIORITY)}
            options={priorities}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.PRIORITY)}
            disabled={isPending}
            required
          />
          <InputSelectField
            control={form.control}
            name="agent_id"
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.AGENT)}
            options={agents}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.AGENT)}
            disabled={isPending}
            required
          />
          <InputSelectField
            control={form.control}
            name="source_id"
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.SOURCE)}
            options={sources}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.SOURCE)}
            disabled={isPending}
            required
          />
          <InputTextArea
            control={form.control}
            name="comment"
            label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.COMMENT)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.COMMENT)}
            className="bg-gray-200 border-gray-200 h-36"
          />
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto" type="submit" disabled={isPending}>
          {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.ADD)}
        </Button>
      </form>
    </Form>
  );
}

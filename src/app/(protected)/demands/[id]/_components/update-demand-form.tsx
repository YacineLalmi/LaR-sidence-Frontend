"use client";

import { updateDemandAction } from "@/actions/demands/update-demand.action";
import Section from "@/app/(protected)/biens/create/_components/section";
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
import { Demand } from "@/schemas/demands/demand.schema";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  demand: Demand;
  types: ListItem[];
  status: ListItem[];
  priorities: ListItem[];
  sources: ListItem[];
  clients: ListItem[];
  biens: ListItem[];
  agents: ListItem[];
}

export default function UpdateDemandForm({
  types,
  status,
  priorities,
  sources,
  clients,
  biens,
  agents,
  demand,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<DemandForm>({
    resolver: zodResolver(DemandFormSchema),
    defaultValues: {
      // title: demand.title,
      type_id: demand.type?.id.toString(),
      client_id: demand.client?.id.toString(),
      source_id: demand.source?.id.toString(),
      bien_id: demand.bien?.id.toString(),
      agent_id: demand.agent?.id.toString(),
      status_id: demand.status?.id.toString(),
      priority_id: demand.priority?.id.toString(),
      budget: demand.budget,
      comment: demand.comment,
    },
  });

  async function onSubmit(values: DemandForm) {
    setIsPending(true);
    try {
      const response = await updateDemandAction(values, demand.id);
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
    customToast.error(`${field}: ${error.message}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-1 gap-3">
          <Section header={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.TITLE)}>
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
              options={clients}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.CLIENT)}
              disabled={isPending}
              required
            />
            <InputSearchField
              control={form.control}
              name="bien_id"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.BIEN)}
              options={biens}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.BIEN)}
              disabled={isPending}
              required
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
              disabled={isPending}
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.BUDGET)}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.BUDGET)}
            />
          </Section>
        </div>
        <div className="grid grid-cols-1 gap-3">
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
          {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.APPLY)}
        </Button>
      </form>
    </Form>
  );
}

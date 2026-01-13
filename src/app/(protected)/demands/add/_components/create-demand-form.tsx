"use client";

import { createDemandAction } from "@/actions/demands/create.action";
import Section from "@/app/(protected)/biens/add/_components/section";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { customToast } from "@/lib/utils";
import { DemandForm, DemandFormSchema } from "@/schemas/demands/demand-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
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
      title: "",
      type_id: "",
      client_id: "",
      source_id: "",
      bien_id: "",
      agent_id: "",
      status_id: "",
      priority_id: "",
      budget: undefined,
      comment: "",
    },
  });

  async function onSubmit(values: DemandForm) {
    setIsPending(true);
    try {
      const response = await createDemandAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push(NAVIGATION_KEYS.DEMANDS.ROOT);
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
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
          <Section header={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.TITLE)}>
            <InputTextField
              control={form.control}
              name="title"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.TITLE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.TITLE)}
            />
            <InputSelectField
              control={form.control}
              name="type_id"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.TYPE)}
              options={types}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.TYPE)}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="client_id"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.CLIENT)}
              options={clients}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.CLIENT)}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="bien_id"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.BIEN)}
              options={biens}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.BIEN)}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="status_id"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.STATUS)}
              options={status}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.STATUS)}
              disabled={isPending}
              required
            />
            <InputTextField
              control={form.control}
              name="budget"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.BUDGET)}
              disabled={isPending}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.BUDGET)}
            />
          </Section>
        </div>
        <div>
          <Section header={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.TITLE)}>
            <InputSelectField
              control={form.control}
              name="priority_id"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.PRIORITY)}
              options={priorities}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.PRIORITY)}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="agent_id"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.AGENT)}
              options={agents}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.AGENT)}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="source_id"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.SOURCE)}
              options={sources}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.SOURCE)}
              disabled={isPending}
              required
            />
            <InputTextArea
              control={form.control}
              name="comment"
              label={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.LABELS.COMMENT)}
              disabled={isPending}
              placeholder={translation(TRANSLATIONS_KEYS.DEMANDS.FORM.INPUTS.PLACEHOLDERS.COMMENT)}
              rows={10}
            />
          </Section>
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto" type="submit" disabled={isPending}>
          {translation("demands.form.publish")}
        </Button>
      </form>
    </Form>
  );
}

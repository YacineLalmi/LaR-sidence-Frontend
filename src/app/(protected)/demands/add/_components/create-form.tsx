"use client";

import { createDemandAction } from "@/actions/demands/create.action";
import Section from "@/app/(protected)/biens/add/_components/section";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
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
  const t = useTranslations();

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
        router.push("/demands");
        customToast.success(t("common.success.operationcompleted"));
      } else {
        customToast.error(response.errorMessage || t("common.errors.somethingwrong"));
      }
    } catch (error) {
      console.log(error);
      customToast.error(t("common.errors.somethingwrong"));
      setIsPending(false);
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
          <Section header={t("demands.form.sections.generalInformation")}>
            <InputTextField
              control={form.control}
              name="title"
              label={t("demands.form.label.title")}
              disabled={isPending}
              required
              placeholder={t("demands.form.placeholder.title")}
            />
            <InputSelectField
              control={form.control}
              name="type_id"
              label={t("demands.form.label.type")}
              options={types}
              placeholder={t("demands.form.placeholder.type")}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="agent_id"
              label={t("demands.form.label.agent")}
              options={agents}
              placeholder={t("demands.form.placeholder.agent")}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="client_id"
              label={t("demands.form.label.client")}
              options={clients}
              placeholder={t("demands.form.placeholder.client")}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="bien_id"
              label={t("demands.form.label.bien")}
              options={biens}
              placeholder={t("demands.form.placeholder.bien")}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="status_id"
              label={t("demands.form.label.status")}
              options={status}
              placeholder={t("demands.form.placeholder.status")}
              disabled={isPending}
              required
            />
            <InputTextField
              control={form.control}
              name="budget"
              label={t("demands.form.label.budget")}
              disabled={isPending}
              placeholder={t("demands.form.placeholder.budget")}
            />
            <InputSelectField
              control={form.control}
              name="priority_id"
              label={t("demands.form.label.priority")}
              options={priorities}
              placeholder={t("demands.form.placeholder.priority")}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="source_id"
              label={t("demands.form.label.source")}
              options={sources}
              placeholder={t("demands.form.placeholder.source")}
              disabled={isPending}
              required
            />
          </Section>
        </div>
        <div>
          <Section header={t("demands.form.sections.internalComments")}>
            <InputTextArea
              control={form.control}
              name="comment"
              label={t("demands.form.label.comment")}
              disabled={isPending}
              placeholder={t("demands.form.placeholder.comment")}
              rows={10}
            />
          </Section>
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto" type="submit" disabled={isPending}>
          {t("demands.form.publish")}
        </Button>
      </form>
    </Form>
  );
}

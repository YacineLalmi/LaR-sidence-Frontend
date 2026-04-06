"use client";

import { createEventAction } from "@/actions/events/create-event.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { EventForm, EventFormSchema } from "@/schemas/events/event-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { InputDateTimeField } from "@/components/custom-inputs/input-datetime";
import { ROUTES } from "@/constants/routes";

interface Props {
  eventTypes: ListItem[];
  agents: ListItem[];
  biens: ListItem[];
  clients: ListItem[];
}
interface Props {}
export default function CreateEventForm({ eventTypes, agents, biens, clients }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<EventForm>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: undefined,
      end_date: undefined,
      type_id: undefined,
      agent_id: undefined,
      bien_id: undefined,
      client_id: undefined,
    },
  });

  async function onSubmit(values: EventForm) {
    setIsPending(true);
    try {
      const response = await createEventAction(values);
      if (response.isOk) {
        router.push(ROUTES.EVENTS.ROOT);
        customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
      } else
        customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } finally {
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
        <div className="grid gap-3">
          <InputTextField
            control={form.control}
            name="title"
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.TITLE)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.TITLE)}
          />
          <div className="grid grid-cols-2 gap-3">
            <InputDateTimeField
              control={form.control}
              name="start_date"
              label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.START_DATE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.START_DATE)}
            />
            <InputDateTimeField
              control={form.control}
              name="end_date"
              label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.END_DATE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.END_DATE)}
            />
          </div>
          <InputSelectField
            control={form.control}
            name="type_id"
            options={eventTypes}
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.TYPE)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.TYPE)}
          />
          <InputSelectField
            control={form.control}
            name="agent_id"
            options={agents}
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.AGENT)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.AGENT)}
          />
          <InputSelectField
            control={form.control}
            name="bien_id"
            options={biens}
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.BIEN)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.BIEN)}
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            options={clients}
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.CLIENT)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.CLIENT)}
          />
        </div>
        <div>
          <InputTextArea
            control={form.control}
            name="description"
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.DESCRIPTION)}
            disabled={isPending}
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.DESCRIPTION)}
          />
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto" type="submit">
          {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT)}
        </Button>
      </form>
    </Form>
  );
}

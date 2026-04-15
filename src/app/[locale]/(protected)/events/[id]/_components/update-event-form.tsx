"use client";

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
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { InputDateTimeField } from "@/components/custom-inputs/input-datetime";
import { Event } from "@/schemas/events/event.schema";
import { updateEventAction } from "@/actions/events/update-event.action";
import { ROUTES } from "@/constants/routes";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import { getBienListAction } from "@/actions/Bien/get-biens-list.action";
import { getAgentListAction } from "@/actions/users/get-agents-list.action";
import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { CATEGORIES, SCOPES } from "@/services/classification.service";

interface Props {
  event: Event;
}
interface Props {}
export default function UpdateEventForm({ event }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [types, setTypes] = useState<ListItem[]>([]);
  const [agents, setAgents] = useState<ListItem[]>([]);
  const [biens, setBiens] = useState<ListItem[]>([]);
  const [clients, setClients] = useState<ListItem[]>([]);
  const [isTypesPending, startTypesTransition] = useTransition();
  const [isAgentsPending, startAgentsTransition] = useTransition();
  const [isBiensPending, startBiensTransition] = useTransition();
  const [isClientsPending, startClientsTransition] = useTransition();

  // fetching types
  useEffect(() => {
    startTypesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.EVENT);
        setTypes(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setTypes([]);
      }
    });

    startAgentsTransition(async () => {
      try {
        const results = await getAgentListAction();
        setAgents(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setAgents([]);
      }
    });

    startBiensTransition(async () => {
      try {
        const results = await getBienListAction();
        setBiens(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setBiens([]);
      }
    });

    startClientsTransition(async () => {
      try {
        const results = await getClientListAction();
        setClients(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setClients([]);
      }
    });
  }, []);

  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<EventForm>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: event.title,
      description: event.description,
      start_date: new Date(event.start_date),
      end_date: new Date(event.end_date),
      type_id: event.type?.id.toString(),
      agent_id: event.agent?.id.toString(),
      bien_id: event?.bien?.id.toString(),
      client_id: event.client?.id.toString(),
    },
  });

  async function onSubmit(values: EventForm) {
    setIsPending(true);
    try {
      const response = await updateEventAction(values, event.id);
      setIsPending(false);
      if (response.isOk) {
        router.push(ROUTES.EVENTS.ROOT);
        customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
      } else
        customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid grid-cols-2 gap-5">
        <div className="grid gap-3">
          <InputTextField
            control={form.control}
            name="title"
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.TITLE)}
            disabled={isPending}
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
            options={types}
            isPending={isTypesPending}
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.TYPE)}
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.TYPE)}
            disabled={isPending}
            required
          />
          <InputSelectField
            control={form.control}
            name="agent_id"
            options={agents}
            isPending={isAgentsPending}
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.AGENT)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.AGENT)}
          />
          <InputSelectField
            control={form.control}
            name="bien_id"
            options={biens}
            isPending={isBiensPending}
            label={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.LABELS.BIEN)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS_2.EVENTS.FORM.PLACEHOLDERS.BIEN)}
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            options={clients}
            isPending={isClientsPending}
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

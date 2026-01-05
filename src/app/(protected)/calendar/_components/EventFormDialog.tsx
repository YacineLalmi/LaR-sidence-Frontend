"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import InputTextField from "@/components/custom-inputs/input-text";
import { InputDateTimeField } from "@/components/custom-inputs/input-datetime";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { EventForm, EventFormSchema } from "@/schemas/events/event-form.schema";
import { createEventAction } from "@/actions/events/create.action";
import { EventsService } from "@/services/events.service";
import { ListItem } from "@/schemas/Global.schema";
import { customToast } from "@/lib/utils";
import { Plus } from "lucide-react";

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDate?: Date;
  onSuccess?: () => void;
}

export default function EventFormDialog({ open, onOpenChange, initialDate, onSuccess }: EventFormDialogProps) {
  const t = useTranslations("calendar");
  const tCommon = useTranslations("common");
  const [isPending, setIsPending] = useState(false);
  const [eventTypes, setEventTypes] = useState<ListItem[]>([]);
  const [agents, setAgents] = useState<ListItem[]>([]);
  const [biens, setBiens] = useState<ListItem[]>([]);
  const [clients, setClients] = useState<ListItem[]>([]);

  const form = useForm<EventForm>({
    resolver: zodResolver(EventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start_date: initialDate || new Date(),
      end_date: initialDate ? new Date(initialDate.getTime() + 60 * 60 * 1000) : new Date(Date.now() + 60 * 60 * 1000),
      type_id: undefined,
      agent_id: undefined,
      bien_id: undefined,
      client_id: undefined,
    },
  });

  useEffect(() => {
    if (open) {
      // Reset form first
      form.reset({
        title: "",
        description: "",
        start_date: initialDate || new Date(),
        end_date: initialDate ? new Date(initialDate.getTime() + 60 * 60 * 1000) : new Date(Date.now() + 60 * 60 * 1000),
        type_id: undefined,
        agent_id: undefined,
        bien_id: undefined,
        client_id: undefined,
      });

      // Load options when dialog opens
      Promise.all([
        EventsService.getEventTypes(),
        EventsService.getAgents(),
        EventsService.getBiens(),
        EventsService.getClients(),
      ])
        .then(([types, agentsList, biensList, clientsList]) => {
          console.log("Loaded options:", { types, agentsList, biensList, clientsList });
          setEventTypes(Array.isArray(types) ? types : []);
          setAgents(Array.isArray(agentsList) ? agentsList : []);
          setBiens(Array.isArray(biensList) ? biensList : []);
          setClients(Array.isArray(clientsList) ? clientsList : []);
        })
        .catch((error) => {
          console.error("Error loading form options:", error);
          customToast.error(tCommon("errors.somethingwrong"));
          // Set empty arrays on error
          setEventTypes([]);
          setAgents([]);
          setBiens([]);
          setClients([]);
        });
    } else {
      // Clear data when dialog closes
      setEventTypes([]);
      setAgents([]);
      setBiens([]);
      setClients([]);
    }
  }, [open, initialDate, form, tCommon]);

  async function onSubmit(values: EventForm) {
    setIsPending(true);
    try {
      const response = await createEventAction(values);
      setIsPending(false);
      if (response.isOk) {
        customToast.success(t("actions.createEvent") + " - " + tCommon("success.operationcompleted"));
        onOpenChange(false);
        form.reset();
        if (onSuccess) {
          onSuccess();
        }
      } else {
        customToast.error(response.errorMessage || tCommon("errors.somethingwrong"));
      }
    } catch (error) {
      setIsPending(false);
      customToast.error(tCommon("errors.somethingwrong"));
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("actions.createEvent")}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <InputTextField
              control={form.control}
              name="title"
              label={t("form.title.label")}
              placeholder={t("form.title.placeholder")}
              required
            />

            <InputDateTimeField
              control={form.control}
              name="start_date"
              label={t("form.startDate.label")}
              placeholder={t("form.startDate.placeholder")}
              required
            />

            <InputDateTimeField
              control={form.control}
              name="end_date"
              label={t("form.endDate.label")}
              placeholder={t("form.endDate.placeholder")}
              required
            />

            <InputSelectField
              control={form.control}
              name="type_id"
              label={t("form.type.label")}
              placeholder={t("form.type.placeholder")}
              options={eventTypes}
              required
            />

            <InputSelectField
              control={form.control}
              name="agent_id"
              label={t("form.agent.label")}
              placeholder={t("form.agent.placeholder")}
              options={agents}
              required
            />

            <InputSelectField
              control={form.control}
              name="bien_id"
              label={t("form.bien.label")}
              placeholder={t("form.bien.placeholder")}
              options={biens}
              required
            />

            <InputSelectField
              control={form.control}
              name="client_id"
              label={t("form.client.label")}
              placeholder={t("form.client.placeholder")}
              options={clients}
              required
            />

            <InputTextArea
              control={form.control}
              name="description"
              label={t("form.description.label")}
              placeholder={t("form.description.placeholder")}
              rows={6}
              required
            />

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>
                {t("actions.cancel")}
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "..." : t("actions.publish")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}


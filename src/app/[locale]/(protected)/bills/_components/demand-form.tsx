"use client";

import { getBienListAction } from "@/actions/Bien/get-biens-list.action";
import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import { createDemandAction } from "@/actions/demands/create-demand.action";
import { getAgentListAction } from "@/actions/users/get-agents-list.action";
import Section from "@/app/[locale]/(protected)/biens/[id]/_components/section";
import { InputSearchField } from "@/components/custom-inputs/input-search";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import { customToast } from "@/lib/utils";
import { DemandForm as DemandFormType, DemandFormSchema } from "@/schemas/demands/demand-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import CreateClientDialog from "../../clients/_components/create-client-dialog";
import { Client } from "@/schemas/clients/client.schema";
import { Plus } from "lucide-react";

interface Props {
  initialData: DemandFormType;
  submitAction: (values: DemandFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: () => void;
}

export default function DemandForm({
  initialData,
  submitAction,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED,
  formId,
  successAction,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<DemandFormType>({
    resolver: zodResolver(DemandFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: DemandFormType) {
    setIsPending(true);
    try {
      const response = await submitAction(values);
      setIsPending(false);
      if (response.isOk) {
        successAction ? successAction() : router.refresh();
        customToast.success(translation(successMessage));
      } else customToast.error(response.errorMessage || translation(errorMessage));
    } catch (error) {
      customToast.error(translation(errorMessage));
    }
  }

  const [isClientDialogOpen, setIsClientDialogOpen] = useState<boolean>(false);

  const [types, setTypes] = useState<ListItem[]>([]);
  const [statuses, setStatuses] = useState<ListItem[]>([]);
  const [agents, setAgents] = useState<ListItem[]>([]);
  const [clients, setClients] = useState<ListItem[]>([]);
  const [biens, setBiens] = useState<ListItem[]>([]);
  const [priorities, setPriorities] = useState<ListItem[]>([]);
  const [sources, setSources] = useState<ListItem[]>([]);
  const [isTypesPending, startTypesTransition] = useTransition();
  const [isStatuesPending, startStatuesTransition] = useTransition();
  const [isAgentsPending, startAgentsTransition] = useTransition();
  const [isClientsPending, startClientsTransition] = useTransition();
  const [isBiensPending, startBiensTransition] = useTransition();
  const [isSourcesPending, startSourcesTransition] = useTransition();
  const [isPrioritiesPending, startPrioritiesTransition] = useTransition();

  // fetching types
  useEffect(() => {
    if (!open) return;

    startTypesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.DEMAND);
        setTypes(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setTypes([]);
      }
    });

    startStatuesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.DEMAND);
        setStatuses(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setStatuses([]);
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
        setClients([]);
      }
    });

    startPrioritiesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.PRIORITY, SCOPES.DEMAND);
        setPriorities(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setClients([]);
      }
    });

    startSourcesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.SOURCE, SCOPES.DEMAND);
        setSources(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setSources([]);
      }
    });
  }, [open]);

  const handleClientCreated = (client: Client) => {
    // Refresh the clients list
    setIsClientDialogOpen(false);
    startClientsTransition(async () => {
      try {
        const results = await getClientListAction();
        setClients(results);
        // Set the newly created client as selected
        form.setValue("client_id", client.id);
        // Show success message
        customToast.success(
          `${translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.CREATED)} - ${client.first_name} ${client.last_name}`,
        );
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid grid-cols-2 gap-5">
          <div className="grid grid-cols-1 gap-3">
            <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.GENERAL_INFORMATION)}>
              <InputSelectField
                control={form.control}
                name="type_id"
                label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.TYPE)}
                options={types}
                placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.TYPE)}
                disabled={isPending}
                isPending={isTypesPending}
                required
              />
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <InputSelectField
                    control={form.control}
                    name="client_id"
                    label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.CLIENT)}
                    options={clients}
                    placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.CLIENT)}
                    disabled={isPending}
                    isPending={isClientsPending}
                    required
                  />
                </div>

                <Button
                  type="button"
                  variant="default"
                  size="icon"
                  onClick={() => setIsClientDialogOpen(true)}
                  className="h-10 w-10 shrink-0 cursor-pointer"
                  title={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.BUTTONS.CREATE)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <InputSelectField
                control={form.control}
                name="bien_id"
                label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.TYPE)}
                options={biens}
                placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.TYPE)}
                disabled={isPending}
                isPending={isBiensPending}
                required
              />
              <InputSelectField
                control={form.control}
                name="status_id"
                label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.STATUS)}
                options={statuses}
                isPending={isStatuesPending}
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
              isPending={isPrioritiesPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.PRIORITY)}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="agent_id"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.AGENT)}
              options={agents}
              isPending={isAgentsPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.PLACEHOLDERS.AGENT)}
              disabled={isPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="source_id"
              label={translation(TRANSLATIONS_KEYS_2.DEMANDS.FORM.LABELS.SOURCE)}
              options={sources}
              isPending={isSourcesPending}
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
            {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT)}
          </Button>
        </form>
      </Form>
      <CreateClientDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        onClientCreated={handleClientCreated}
      />
    </>
  );
}

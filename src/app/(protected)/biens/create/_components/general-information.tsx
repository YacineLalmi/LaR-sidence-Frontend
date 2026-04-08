"use client";
import InputSelectField from "@/components/custom-inputs/input-select";
import { ListItem } from "@/schemas/global.schema";
import { useTranslations } from "next-intl";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import InputNumberField from "@/components/custom-inputs/input-number";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { useEffect, useState, useTransition } from "react";
import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { getAgentListAction } from "@/actions/users/get-agents-list.action";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Client } from "@/schemas/clients/client.schema";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
  setIsClientDialogOpen: (v: boolean) => void;
  clients: ListItem[];
  isClientsPending: boolean;
}

export default function GeneralInformation({
  form,
  isPending = false,
  setIsClientDialogOpen,
  clients,
  isClientsPending,
}: Props) {
  const translation = useTranslations();

  const [types, setTypes] = useState<ListItem[]>([]);
  const [transactionTypes, setTransactionTypes] = useState<ListItem[]>([]);
  const [statuses, setStatuses] = useState<ListItem[]>([]);
  const [agents, setAgents] = useState<ListItem[]>([]);

  const [isTypesPending, startTypesTransition] = useTransition();
  const [isTransactionTypesPending, startTransactionTypesTransition] = useTransition();
  const [isStatusesPending, startStatusesTransition] = useTransition();
  const [isAgentsPending, startAgentsTransition] = useTransition();

  useEffect(() => {
    startStatusesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.BIEN);
        setStatuses(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setStatuses([]);
      }
    });

    startTypesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.BIEN);
        setTypes(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setTypes([]);
      }
    });

    startTransactionTypesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.TRANSACTION);
        setTransactionTypes(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setTransactionTypes([]);
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
  }, []);

  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.GENERAL_INFORMATION)}>
      {/* Client row: search field + add button */}
      <div className="flex gap-2 items-end">
        <div className="flex-1">
          <InputSelectField
            control={form.control as Control<BienFormInput, any, any>}
            name="client_id"
            label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.CLIENT)}
            placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.CLIENT)}
            options={clients}
            isPending={isClientsPending}
            disabled={isPending}
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

      {/* Rest of the form */}
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="bien_type_id"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.BIEN_TYPE)}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.BIEN_TYPE)}
        options={types}
        isPending={isTypesPending}
        disabled={isPending}
        required
      />
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="transaction_type_id"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.TRANSACTION_TYPE)}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.TRANSACTION_TYPE)}
        options={transactionTypes}
        isPending={isTransactionTypesPending}
        disabled={isPending}
        required
      />
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="bien_status_id"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.BIEN_STATUS)}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.BIEN_STATUS)}
        options={statuses}
        isPending={isStatusesPending}
        disabled={isPending}
        required
      />
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="agent_id"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.AGENT)}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.AGENT)}
        options={agents}
        isPending={isAgentsPending}
        disabled={isPending}
        required
      />
      <InputNumberField
        control={form.control as Control<BienFormInput, any, any>}
        name="price"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.PRICE)}
        disabled={isPending}
        required
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.PRICE)}
      />
      <InputNumberField
        control={form.control as Control<BienFormInput, any, any>}
        name="monthly_charges"
        label={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.LABELS.MONTHLY_CHARGES)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.PLACEHOLDERS.MONTHLY_CHARGES)}
      />
    </Section>
  );
}

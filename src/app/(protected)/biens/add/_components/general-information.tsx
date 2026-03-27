"use client";
import InputSelectField from "@/components/custom-inputs/input-select";
import { ListItem } from "@/schemas/global.schema";
import { useTranslations } from "next-intl";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import InputNumberField from "@/components/custom-inputs/input-number";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { InputSearchField } from "@/components/custom-inputs/input-search";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
  bienTypes: ListItem[];
  transactionsTypes: ListItem[];
  status: ListItem[];
  agents: ListItem[];
  clients: ListItem[];
  clientTypes: ListItem[];
  clientStatus: ListItem[];
  clientSources: ListItem[];
  civilities: ListItem[];
}

export default function GeneralInformation({
  form,
  isPending = false,
  bienTypes,
  transactionsTypes,
  status,
  agents,
  clients,
}: Props) {
  const translation = useTranslations();

  return (
    <Section header={translation(TRANSLATIONS_KEYS.BIENS.FORM.GENERAL_INFORMATION)}>
      {/* Client row: search field + add button */}
      <InputSearchField
        control={form.control as Control<BienFormInput, any, any>}
        name="client_id"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.CLIENT)}
        disabled={isPending}
        required
        options={clients}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.CLIENT)}
      />

      {/* Rest of the form */}
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="bien_type_id"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.BIEN_TYPE)}
        options={bienTypes}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.BIEN_TYPE)}
        disabled={isPending}
        required
      />
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="transaction_type_id"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.TRANSACTION_TYPE)}
        options={transactionsTypes}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.TRANSACTION_TYPE)}
        disabled={isPending}
        required
      />
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="bien_status_id"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.BIEN_STATUS)}
        options={status}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.BIEN_STATUS)}
        disabled={isPending}
        required
      />
      <InputSelectField
        control={form.control as Control<BienFormInput, any, any>}
        name="agent_id"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.AGENT)}
        options={agents}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.AGENT)}
        disabled={isPending}
        required
      />
      <InputNumberField
        control={form.control as Control<BienFormInput, any, any>}
        name="price"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.PRICE)}
        disabled={isPending}
        required
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.PRICE)}
      />
      <InputNumberField
        control={form.control as Control<BienFormInput, any, any>}
        name="monthly_charges"
        label={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.LABELS.MONTHLY_CHARGES)}
        disabled={isPending}
        placeholder={translation(TRANSLATIONS_KEYS.BIENS.FORM.INPUTS.PLACEHOLDERS.MONTHLY_CHARGES)}
      />
    </Section>
  );
}

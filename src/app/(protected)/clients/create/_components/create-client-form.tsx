"use client";

import { createClientAction } from "@/actions/clients/create-client.action";
import Section from "@/app/(protected)/biens/create/_components/section";
import InputFileLarge2 from "@/components/custom-inputs/input-file-large-2";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { ClientForm, ClientFormSchema } from "@/schemas/clients/client-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  types: ListItem[];
  status: ListItem[];
  sources: ListItem[];
  civilities: ListItem[];
}
export default function CreateClientForm({ types, status, sources, civilities }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);

  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<ClientForm>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      civility: undefined,
      last_name: "",
      first_name: "",
      source_id: undefined,
      email: "",
      phone_numbers: [],
      documents: [],
      comment: "",
      company_name: "",
      trade_register: "",
      tax_identification: "",
      mobile: "",
      ai: "",
      status_id: undefined,
      type_id: undefined,
    },
  });

  async function onSubmit(values: ClientForm) {
    setIsPending(true);
    try {
      const response = await createClientAction(values);
      setIsPending(false);
      if (response.isOk) {
        router.push(ROUTES.CLIENTS.ROOT);
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
        <div className="grid gap-3">
          <Section header="Information Générale">
            <InputSelectField
              control={form.control}
              name="civility"
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.CIVILITY)}
              options={civilities}
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.CIVILITY)}
              disabled={isPending}
              required
            />

            {form.watch("civility") === "company" ? (
              <div className="grid grid-cols-2 gap-3">
                <InputTextField
                  control={form.control}
                  name="company_name"
                  label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.COMPANY_NAME)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.COMPANY_NAME)}
                />
                <InputTextField
                  control={form.control}
                  name="trade_register"
                  label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.TRADE_REGISTRATION)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.TRADE_REGISTRATION)}
                />
                <InputTextField
                  control={form.control}
                  name="tax_identification"
                  label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.TAX_IDENTIFICATION)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.TAX_IDENTIFICATION)}
                />
                <InputTextField
                  control={form.control}
                  name="ai"
                  label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.AI)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.AI)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <InputTextField
                  control={form.control}
                  name="first_name"
                  label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.FIRST_NAME)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.FIRST_NAME)}
                />
                <InputTextField
                  control={form.control}
                  name="last_name"
                  label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.LAST_NAME)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.LAST_NAME)}
                />
              </div>
            )}

            <InputTextField
              control={form.control}
              name="email"
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.EMAIL)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.EMAIL)}
            />

            <InputTextField
              control={form.control}
              name="mobile"
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.MOBILE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.MOBILE)}
            />
            <div className="grid grid-cols-2 gap-3 items-end">
              {phoneNumbers.map((_, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <InputTextField
                    control={form.control}
                    name={`phone_numbers.${index}`}
                    label={`${translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.PHONE_NUMBER, { index: index + 1 })}`}
                    placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.PHONE_NUMBER)}
                    RightIcon={Trash2}
                    RightIconOnClick={() => {
                      const newPhones = phoneNumbers.filter((_, i) => i !== index);
                      setPhoneNumbers(newPhones);
                      form.setValue("phone_numbers", newPhones);
                    }}
                    disabled={isPending}
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={() => {
                  setPhoneNumbers((prev) => {
                    form.setValue("phone_numbers", [...prev, ""]);
                    return [...prev, ""];
                  });
                }}
                className="mt-2"
              >
                <Plus className="h-4 w-4 mr-2" />
              </Button>
            </div>
            <InputTextArea
              control={form.control}
              name="comment"
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.COMMENT)}
              disabled={isPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.COMMENT)}
            />
          </Section>
        </div>
        <div>
          <Section header="Docmuments">
            <InputFileLarge2 control={form.control} name="documents" form={form} />
            <InputSelectField
              control={form.control}
              name="source_id"
              options={sources}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.SOURCE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.SOURCE)}
            />
            <InputSelectField
              control={form.control}
              name="type_id"
              options={types}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.TYPE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.TYPE)}
            />
            <InputSelectField
              control={form.control}
              name="status_id"
              options={status}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.STATUS)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.STATUS)}
            />
          </Section>
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT)}
        </Button>
      </form>
    </Form>
  );
}

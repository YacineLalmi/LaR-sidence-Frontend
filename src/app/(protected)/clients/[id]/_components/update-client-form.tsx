"use client";

import { updateClientAction } from "@/actions/clients/update.action";
import Section from "@/app/(protected)/biens/add/_components/section";
import InputFileLarge2 from "@/components/custom-inputs/input-file-large-2";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { customToast, fetchFileAsFileObject } from "@/lib/utils";
import { ClientForm, ClientFormSchema } from "@/schemas/clients/client-form.schema";
import { Client } from "@/schemas/clients/client.schema";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  client: Client;
  types: ListItem[];
  status: ListItem[];
  sources: ListItem[];
  civilities: ListItem[];
}
export default function UpdateClientForm({ types, status, sources, civilities, client }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>(client.phone_numbers);
  const [areFileLoading, setAreFilesLoading] = useState<boolean>(false);

  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<ClientForm>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: {
      civility: client.civility,
      last_name: client.last_name,
      first_name: client.first_name,
      source_id: client.source.id.toString(),
      email: client.email,
      mobile: client.mobile,
      phone_numbers: client.phone_numbers,
      documents: [],
      comment: client.comment || "",
      company_name: client.company_name,
      trade_register: client.trade_register,
      tax_identification: client.tax_identification,
      ai: client.ai,
      status_id: client.status.id.toString(),
      type_id: client.type.id.toString(),
    },
  });

  useEffect(() => {
    const loadFiles = async () => {
      setAreFilesLoading(true);
      try {
        // Fetch documents
        const documentPromises = client.documents.map((doc) =>
          fetchFileAsFileObject(doc.id, doc.original_name, doc.mime_type),
        );
        const documents = await Promise.all(documentPromises);
        const validDocuments = documents.filter((doc): doc is File => doc !== null);

        form.setValue("documents", validDocuments as any);
      } catch (error) {
        console.error("Error loading files:", error);
        customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.LOADING_FILES));
      } finally {
        setAreFilesLoading(false);
      }
    };

    loadFiles();
    return () => {
      setAreFilesLoading(false);
      setIsPending(false);
      setPhoneNumbers([]);
    };
  }, [client, form, customToast]);

  async function onSubmit(values: ClientForm) {
    setIsPending(true);
    try {
      const response = await updateClientAction(values, client.id);
      setIsPending(false);
      if (response.isOk) {
        router.push(NAVIGATION_KEYS.CLIENTS.ROOT);
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
        <div className="grid gap-3">
          <Section header="Information Générale">
            <InputSelectField
              control={form.control}
              name="civility"
              label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.CIVILITY)}
              options={civilities}
              placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.CIVILITY)}
              disabled={isPending}
              required
            />
            {form.watch("civility") === "C" ? (
              <div className="grid grid-cols-2 gap-3">
                <InputTextField
                  control={form.control}
                  name="company_name"
                  label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.COMPANY_NAME)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.COMPANY_NAME)}
                />
                <InputTextField
                  control={form.control}
                  name="trade_register"
                  label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.TRADE_REGISTRATION)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.TRADE_REGISTRATION)}
                />
                <InputTextField
                  control={form.control}
                  name="tax_identification"
                  label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.TAX_IDENTIFICATION)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.TAX_IDENTIFICATION)}
                />
                <InputTextField
                  control={form.control}
                  name="ai"
                  label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.AI)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.AI)}
                />
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <InputTextField
                  control={form.control}
                  name="first_name"
                  label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.FIRST_NAME)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.FIRST_NAME)}
                />
                <InputTextField
                  control={form.control}
                  name="last_name"
                  label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.LAST_NAME)}
                  disabled={isPending}
                  required
                  placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.LAST_NAME)}
                />
              </div>
            )}

            <InputTextField
              control={form.control}
              name="email"
              label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.EMAIL)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.EMAIL)}
            />

            <InputTextField
              control={form.control}
              name="mobile"
              label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.MOBILE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.MOBILE)}
            />
            <div className="grid grid-cols-2 gap-3 items-end">
              {phoneNumbers.map((_, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <InputTextField
                    control={form.control}
                    name={`phone_numbers.${index}`}
                    label={`${translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.PHONE_NUMBER, { index: index + 1 })}`}
                    placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.PHONE_NUMBER)}
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
              label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.COMMENT)}
              disabled={isPending}
              placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.COMMENT)}
            />
          </Section>
        </div>
        <div>
          <Section header="Docmuments">
            <InputFileLarge2 control={form.control} name="documents" form={form} areFileLoading={areFileLoading} />
            <InputSelectField
              control={form.control}
              name="source_id"
              options={sources}
              label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.SOURCE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.SOURCE)}
            />
            <InputSelectField
              control={form.control}
              name="type_id"
              options={types}
              label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.TYPE)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.TYPE)}
            />
            <InputSelectField
              control={form.control}
              name="status_id"
              options={status}
              label={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.LABEL.STATUS)}
              disabled={isPending}
              required
              placeholder={translation(TRANSLATIONS_KEYS.CLIENTS.FORM.PLACEHOLDER.STATUS)}
            />
          </Section>
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {translation(TRANSLATIONS_KEYS.COMMON.APPLY)}
        </Button>
      </form>
    </Form>
  );
}

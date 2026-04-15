"use client";

import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import Section from "@/app/[locale]/(protected)/biens/create/_components/section";
import InputFileLarge2 from "@/components/custom-inputs/input-file-large-2";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputSelectFetchField from "@/components/custom-inputs/input-select-fetch";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import { customToast, fetchFileAsFileObject } from "@/lib/utils";
import { ClientForm as ClientFormType, ClientFormSchema } from "@/schemas/clients/client-form.schema";
import { Client } from "@/schemas/clients/client.schema";
import { File } from "@/schemas/file/file.schema";
import { ListItem } from "@/schemas/global.schema";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

interface Props {
  initialData: ClientFormType;
  submitAction: (values: ClientFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: (client: Client) => void;
  documents?: File[];
}
export default function ClientForm({
  initialData,
  submitAction,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED,
  formId,
  successAction,
  documents,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [phoneNumbers, setPhoneNumbers] = useState<string[]>([]);
  const [areFileLoading, setAreFilesLoading] = useState<boolean>(false);

  // Select Options
  const [types, setTypes] = useState<ListItem[]>([]);
  const [statuses, setStatuses] = useState<ListItem[]>([]);
  const [sources, setSources] = useState<ListItem[]>([]);
  const [isTypesPending, startTypesTransition] = useTransition();
  const [isStatusesPending, startStatusesTransition] = useTransition();
  const [isSourcesPending, startSourcesTransition] = useTransition();

  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<ClientFormType>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: initialData,
  });

  const civilities: ListItem[] = [
    {
      id: "mrs",
      name: "Female",
    },
    {
      id: "mr",
      name: "Male",
    },
    {
      id: "company",
      name: "Company",
    },
  ];

  useEffect(() => {
    startSourcesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.SOURCE, SCOPES.CLEINT);
        setSources(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setSources([]);
      }
    });
    startStatusesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.CLEINT);
        setStatuses(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setStatuses([]);
      }
    });
    startTypesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.CLEINT);
        setTypes(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setTypes([]);
      }
    });
  }, []);

  async function onSubmit(values: ClientFormType) {
    setIsPending(true);
    try {
      const response = await submitAction(values);
      setIsPending(false);
      if (response.isOk) {
        successAction && response.data ? successAction(response.data) : router.refresh();
        customToast.success(translation(successMessage));
      } else customToast.error(response.errorMessage || translation(errorMessage));
    } catch (error) {
      customToast.error(translation(errorMessage));
    }
  }

  useEffect(() => {
    if (!documents) return;
    const loadFiles = async () => {
      setAreFilesLoading(true);
      try {
        // Fetch documents
        if (documents) {
          const documentPromises: any = documents.map((doc) =>
            fetchFileAsFileObject(doc.id, doc.original_name, doc.mime_type),
          );
          const files = await Promise.all(documentPromises);
          const validFiles = files.filter((doc): doc is File => doc !== null);

          form.setValue("documents", validFiles as any);
        }
      } catch (error) {
        console.error("Error loading files:", error);
        customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.LOADING_FILE_FAILED));
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
  }, [documents, form, customToast]);

  return (
    <Form {...form}>
      <form
        id={formId}
        onSubmit={form.handleSubmit((data, e) => {
          if (e) {
            e.preventDefault();
            e.stopPropagation();
          }
          onSubmit(data);
        })}
        className="space-y-8 grid grid-cols-2 gap-5"
      >
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
            <InputFileLarge2 control={form.control} name="documents" form={form} areFileLoading={areFileLoading} />
            <InputSelectField
              control={form.control}
              name="source_id"
              options={sources}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.SOURCE)}
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.SOURCE)}
              disabled={isPending}
              isPending={isSourcesPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="type_id"
              options={types}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.TYPE)}
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.TYPE)}
              disabled={isPending}
              isPending={isTypesPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="status_id"
              options={statuses}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.STATUS)}
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.STATUS)}
              disabled={isPending}
              isPending={isStatusesPending}
              required
            />
          </Section>
        </div>
        <Button
          className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto"
          type="submit"
          form={formId}
          disabled={isPending}
          onClick={(e) => e.stopPropagation()}
        >
          {isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT)
          )}
        </Button>
      </form>
    </Form>
  );
}

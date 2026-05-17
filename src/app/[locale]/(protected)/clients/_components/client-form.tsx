"use client";

import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import Section from "@/app/[locale]/(protected)/biens/create/_components/section";
import InputFileLarge from "@/components/custom-inputs/input-file/index";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import useFetch from "@/hooks/use-fetch.hook";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import { customToast } from "@/lib/utils";
import { ClientForm as ClientFormType, ClientFormSchema } from "@/schemas/clients/client-form.schema";
import { Client } from "@/schemas/clients/client.schema";
import { ListItem } from "@/schemas/global.schema";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { FileOrDocument } from "@/components/custom-inputs/input-file/file-card";
import { Media } from "@/schemas/global/media.schema";

interface Props {
  initialData: ClientFormType;
  submitAction: (values: ClientFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: (client: Client) => void;
  existingDocuments?: any[]; // API documents array
  isUpdate?: boolean;
}

/**
 * IMPORTANT: Adjust this function to match your API's file serving endpoint
 */
function getDocumentUrl(document: any): string {
  // Debug: Log the document structure
  console.log("Document structure:", document);

  // Try different URL patterns - uncomment the one that works for your API:

  // Pattern 1: Using UUID (most common for Laravel/media library)
  // return `/storage/${document.uuid}/${document.file_name}`;

  // Pattern 2: Using UUID in API route
  // return `/api/files/${document.uuid}`;

  // Pattern 3: Using ID
  // return `/api/documents/${document.id}/download`;

  // Pattern 4: Direct storage path
  // return `/storage/documents/${document.file_name}`;

  // Pattern 5: If you have full URL in response
  // return document.url || document.full_path;

  // Pattern 6: For Laravel with collection name
  const url = `/storage/${document.id}/${document.file_name}`;

  console.log("Constructed URL:", url);
  return url;
}

export default function ClientForm({
  initialData,
  submitAction,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED,
  formId,
  successAction,
  existingDocuments = [],
  isUpdate = false,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [areFileLoading, setAreFilesLoading] = useState<boolean>(false);
  const [displayedDocuments, setDisplayedDocuments] = useState<FileOrDocument[]>([]);

  // Select Options
  const [types, isTypesLoading] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.CLEINT),
    [],
  );

  const [statuses, isStatusesLoading] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.CLEINT),
    [],
  );

  const [sources, isSourcesLoading] = useFetch<ListItem[]>(
    async () => await getClassificationsListAction(CATEGORIES.SOURCE, SCOPES.CLEINT),
    [],
  );

  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<ClientFormType>({
    resolver: zodResolver(ClientFormSchema),
    defaultValues: initialData,
  });

  const civilities: ListItem[] = [
    {
      id: "mrs",
      name: translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.CIVILITY),
    },
    {
      id: "mr",
      name: translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.CIVILITY),
    },
    {
      id: "company",
      name: translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.CIVILITY),
    },
  ];

  // Load existing documents on mount (for update scenario)
  useEffect(() => {
    if (isUpdate && existingDocuments.length > 0) {
      console.log("Loading existing documents:", existingDocuments);
      setAreFilesLoading(true);

      try {
        // Transform API documents to FileOrDocument format
        const transformedDocs: FileOrDocument[] = existingDocuments.map((doc): Media => {
          const url = getDocumentUrl(doc);

          return {
            id: doc.id,
            uuid: doc.uuid,
            name: doc.name,
            file_name: doc.file_name,
            mime_type: doc.mime_type,
            size: doc.size,
            collection_name: "documents",
            created_at: doc.created_at,
            updated_at: doc.updated_at,
            // url: url,
          };
        });

        console.log("Transformed documents:", transformedDocs);
        setDisplayedDocuments(transformedDocs);
      } catch (error) {
        console.error("Error loading documents:", error);
        customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.LOADING_FILE_FAILED));
      } finally {
        setAreFilesLoading(false);
      }
    }
  }, [isUpdate, existingDocuments, translation]);

  async function onSubmit(values: ClientFormType) {
    setIsPending(true);
    try {
      console.log("Submitting form with values:", {
        ...values,
        new_documents: values.new_documents?.length,
        deleted_documents: values.deleted_documents?.length,
      });

      const response = await submitAction(values);
      if (response.isOk) {
        successAction && response.data ? successAction(response.data) : router.refresh();
        customToast.success(translation(successMessage));
      } else {
        customToast.error(response.errorMessage || translation(errorMessage));
      }
    } catch (error) {
      console.error("Form submission error:", error);
      customToast.error(translation(errorMessage));
    } finally {
      setIsPending(false);
    }
  }

  const phoneNumbersFromForm = form.watch("phone_numbers") || [];

  const handleAddingPhoneNumber = useCallback(() => {
    const updatedPhones = [...phoneNumbersFromForm, ""];
    form.setValue("phone_numbers", updatedPhones);
  }, [phoneNumbersFromForm, form]);

  const handleRemovingPhoneNumber = useCallback(
    (index: number) => {
      const updatedPhones = phoneNumbersFromForm.filter((_, i) => i !== index);
      form.setValue("phone_numbers", updatedPhones);
    },
    [phoneNumbersFromForm, form],
  );

  const handleDocumentDelete = useCallback(
    (documentId: string) => {
      console.log("Deleting document:", documentId);

      // Add document ID to deleted_documents array
      const currentDeletedDocs = form.getValues("deleted_documents") || [];
      form.setValue("deleted_documents", [...currentDeletedDocs, documentId]);

      // Update displayed documents
      setDisplayedDocuments((prev) => prev.filter((doc) => "id" in doc && doc.id !== documentId));

      console.log("Updated deleted_documents:", [...currentDeletedDocs, documentId]);
    },
    [form],
  );

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
          <Section header={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.CIVILITY)}>
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
              {phoneNumbersFromForm.map((_, index) => (
                <div key={index} className="flex gap-2 items-start">
                  <InputTextField
                    control={form.control}
                    name={`phone_numbers.${index}`}
                    label={`${translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.PHONE_NUMBER, { index: index + 1 })}`}
                    placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.PHONE_NUMBER)}
                    RightIcon={Trash2}
                    RightIconOnClick={() => handleRemovingPhoneNumber(index)}
                    disabled={isPending}
                  />
                </div>
              ))}
              <Button type="button" variant="default" size="sm" onClick={handleAddingPhoneNumber} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.ADD)}
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
          <Section header={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.DOCUMENTS)}>
            <InputFileLarge
              control={form.control}
              name="new_documents"
              areFileLoading={areFileLoading}
              existingDocuments={displayedDocuments}
              onDocumentDelete={handleDocumentDelete}
            />

            <InputSelectField
              control={form.control}
              name="source_id"
              options={sources}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.SOURCE)}
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.SOURCE)}
              disabled={isPending}
              isPending={isSourcesLoading}
              required
            />

            <InputSelectField
              control={form.control}
              name="type_id"
              options={types}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.TYPE)}
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.TYPE)}
              disabled={isPending}
              isPending={isTypesLoading}
              required
            />

            <InputSelectField
              control={form.control}
              name="status_id"
              options={statuses}
              label={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.LABELS.STATUS)}
              placeholder={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.PLACEHOLDERS.STATUS)}
              disabled={isPending}
              isPending={isStatusesLoading}
              required
            />
          </Section>
        </div>

        <Button
          className="border-1 cursor-pointer w-52 p-5 col-span-2 ml-auto"
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

"use client";

import { getBienListAction } from "@/actions/Bien/get-biens-list.action";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { use, useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Edit, Plus, Upload } from "lucide-react";
import CustomButton from "@/components/ui/custom-button";
import { BillFormSchema, BillForm as BillFormType } from "@/schemas/bills/bill-form.schema";
import useFetch from "@/hooks/use-fetch.hook";
import { InputDateField } from "@/components/custom-inputs/input-date";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { getBillingModelsListAction } from "@/actions/bills/models/get-billing-models-list.action";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";
import CreateBillingModelDialog from "./create-billing-model-dialog";
import UpdateBillingModelDialog from "./update-billing-model-dialog";
import { getBillingModelAction } from "@/actions/bills/models/get-billing-model.actions";

interface Props {
  initialData: BillFormType;
  submitAction: (values: BillFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: () => void;
}

export default function BillForm({
  initialData,
  submitAction,
  successMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED,
  errorMessage = TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_FAILED,
  formId,
  successAction,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [documents, setDocuments] = useState<File[]>([]);
  const router = useRouter();
  const translation = useTranslations();
  const [clients, isClientsPending] = useFetch<ListItem[]>(() => getClientListAction(), []);
  const [biens, isBiensPending] = useFetch<ListItem[]>(() => getBienListAction(), []);
  const [billingModels, setBillingModels] = useState<ListItem[]>([]);
  const [initialBillingModels, isInitialBillingModelsPending] = useFetch<ListItem[]>(
    () => getBillingModelsListAction(),
    [],
  );
  const [selectedBillingModel, setSelectedBillingModel] = useState<BillingModel>();

  const [isCreateBillingModelDialogOpen, setIsCreateBillingModelDialogOpen] = useState(false);
  const [isUpdateBillingModelDialogOpen, setIsUpdateBillingModelDialogOpen] = useState(false);

  const form = useForm<BillFormType>({
    resolver: zodResolver(BillFormSchema),
    defaultValues: initialData,
  });

  async function onSubmit(values: BillFormType) {
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

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDocuments((prev) => [...prev, ...files]);
  };

  const removeDocument = (index: number) => {
    setDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    if (!isInitialBillingModelsPending) {
      setBillingModels(initialBillingModels);
    }
  }, [initialBillingModels, isInitialBillingModelsPending]);

  useEffect(() => {
    if (form.watch("billing_model_id")) {
      getBillingModelAction(form.watch("billing_model_id")).then((billingModel) => {
        if (billingModel.isOk && billingModel.data) {
          setSelectedBillingModel(billingModel.data);
        } else {
          setSelectedBillingModel(undefined);
        }
      });
    }
  }, [form.watch("billing_model_id")]);

  console.log(selectedBillingModel);

  const handleBillingModelCreated = (billingModel: BillingModel) => {
    setIsCreateBillingModelDialogOpen(false);
    setBillingModels((prev) => [...prev, { id: billingModel.id, name: billingModel.name }]);
    form.setValue("billing_model_id", billingModel.id);
    customToast.success(
      `${translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.MESSAGES.CREATED)} - ${billingModel.name}`,
    );
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6">
            {/* Colonne gauche */}
            <div className="space-y-6">
              <InputDateField
                control={form.control}
                name="due_date"
                label={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.LABELS.DUE_DATE)}
                disabled={isPending}
                required
                placeholder={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.PLACEHOLDERS.DUE_DATE)}
              />

              <InputSelectField
                control={form.control}
                name="client_id"
                label={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.LABELS.CLIENT_ID)}
                options={clients}
                placeholder={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.PLACEHOLDERS.CLIENT_ID)}
                disabled={isPending}
                isPending={isClientsPending}
                required
              />

              <InputSelectField
                control={form.control}
                name="bien_id"
                label={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.LABELS.BIEN_ID)}
                options={biens}
                placeholder={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.PLACEHOLDERS.BIEN_ID)}
                disabled={isPending}
                isPending={isBiensPending}
                required
              />

              <InputTextArea
                control={form.control}
                name="services_description"
                label="Description des Prestations"
                placeholder="Saisissez la description des prestations"
                disabled={isPending}
              />
            </div>

            {/* Colonne droite */}
            <div className="space-y-6">
              <div className="flex gap-2 items-end">
                <div className="flex-1">
                  <InputSelectField
                    control={form.control}
                    name="billing_model_id"
                    label={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.LABELS.BILLING_MODEL_ID)}
                    options={billingModels}
                    placeholder={translation(TRANSLATIONS_KEYS_2.BILLS.FORM.PLACEHOLDERS.BILLING_MODEL_ID)}
                    disabled={isPending}
                    isPending={isClientsPending}
                    required
                  />
                </div>

                <CustomButton
                  Icon={Edit}
                  size="icon"
                  variant="outline"
                  disabled={!form.watch("billing_model_id") || isPending}
                  onClick={() => setIsUpdateBillingModelDialogOpen(true)}
                  className="border-black text-black hover:bg-gray-100 p-0"
                />
                <CustomButton
                  Icon={Plus}
                  size="icon"
                  variant="outline"
                  onClick={() => setIsCreateBillingModelDialogOpen(true)}
                  className="border-black text-black hover:bg-gray-100 p-0"
                />
              </div>
              <InputTextField
                control={form.control}
                name="amount_ht"
                label="Montant HT"
                placeholder="Sélectionner une option"
                disabled={isPending}
                required
              />

              <InputTextField
                control={form.control}
                name="tax_amount"
                label="Montant TVA"
                placeholder="Sélectionner une option"
                disabled={isPending}
                required
              />

              <InputTextField
                control={form.control}
                name="total_ttc"
                label="Montant TTC"
                placeholder="Sélectionner une option"
                disabled={isPending}
                required
              />

              <div className="space-y-3">
                <label className="text-sm font-medium">Téléverser des documents</label>
                <label className="block">
                  <input
                    type="file"
                    accept="*/*"
                    multiple
                    className="hidden"
                    onChange={handleDocumentUpload}
                    disabled={isPending}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-2xl p-12 text-center cursor-pointer hover:border-gray-400 transition-colors bg-white">
                    <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-sm text-gray-600">Glissez-déposez vos documents ici ou cliquez pour importer</p>
                  </div>
                </label>

                {/* Liste des documents uploadés */}
                {documents.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {documents.map((doc, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm text-gray-700 truncate">{doc.name}</span>
                        <button
                          type="button"
                          onClick={() => removeDocument(index)}
                          className="text-red-500 hover:text-red-700 text-sm font-medium"
                        >
                          Supprimer
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bouton Publier */}
          <div className="flex justify-end mt-8">
            <CustomButton
              type="submit"
              text="Publier"
              disabled={isPending}
              className="bg-black text-white hover:bg-gray-800 px-8 py-3"
            />
          </div>
        </form>
      </Form>
      <CreateBillingModelDialog
        onBillingModelCreated={handleBillingModelCreated}
        open={isCreateBillingModelDialogOpen}
        onOpenChange={setIsCreateBillingModelDialogOpen}
      />
      <UpdateBillingModelDialog
        billingModel={selectedBillingModel}
        onBillingModelCreated={handleBillingModelCreated}
        open={isUpdateBillingModelDialogOpen}
        onOpenChange={setIsUpdateBillingModelDialogOpen}
      />
    </>
  );
}

"use client";

import InputTextField, { formatters } from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  BillingModelForm as BillingModelFormType,
  BillingModelFormSchema,
} from "@/schemas/bills/models/billing-model-form.schema";
import { Card, CardContent } from "@/components/ui/card";
import CustomButton from "@/components/ui/custom-button";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { getMediaAsBlobAction } from "@/actions/media/get-media.actions";
import InputFileLarge from "@/components/custom-inputs/input-file/index";

interface Props {
  initialData: BillingModelFormType;
  submitAction: (values: BillingModelFormType) => Promise<FormState>;
  successMessage?: string;
  errorMessage?: string;
  formId?: string;
  successAction?: (billingModel: BillingModel) => void;
}

export default function BillingModelForm({
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
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  const form = useForm<BillingModelFormType>({
    resolver: zodResolver(BillingModelFormSchema),
    defaultValues: { ...initialData, logo: undefined },
  });

  // Watch form values for live preview
  const watchedValues = form.watch();

  async function onSubmit(values: BillingModelFormType) {
    console.log(values);
    setIsPending(true);
    try {
      const response = await submitAction(values);
      setIsPending(false);
      if (response.isOk) {
        successAction && response.data ? successAction(response.data) : router.refresh();
      } else customToast.error(response.errorMessage || translation(errorMessage));
    } catch (error) {
      customToast.error(translation(errorMessage));
    }
  }

  useEffect(() => {
    async function loadFile() {
      if (initialData.logo) {
        const result = await getMediaAsBlobAction(initialData.logo?.uuid);
        console.log("gotten logo", result);
        if (result)
          form.setValue(
            "logo",
            new File([result], initialData.logo?.file_name || "logo.png", {
              type: initialData.logo?.mime_type,
            }),
          );
      }
    }
    loadFile();
  }, [initialData]);

  useEffect(() => {
    if (watchedValues.logo) {
      setLogoPreview(URL.createObjectURL(watchedValues.logo));
    }
  }, [watchedValues.logo]);

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  // Calculate preview amounts
  const previewHT = 1000;
  const taxRate = parseFloat(watchedValues.tax_rate) || 0;
  const previewTVA = (previewHT * taxRate) / 100;
  const previewTTC = previewHT + previewTVA;

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Section 1: Informations bancaires */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Informations bancaires</h2>

              <InputTextField
                control={form.control}
                name="name"
                label="Nom"
                disabled={isPending}
                required
                errorInside
                placeholder="Nom de votre modèle de facturation"
              />

              <InputTextField
                control={form.control}
                name="iban"
                label="IBAN"
                disabled={isPending}
                required
                errorInside
                placeholder="FR76 XXXX XXXX XXXX XXXX XXXX XXX"
                formatDisplay={formatters.iban}
              />

              <InputTextField
                control={form.control}
                name="swift_bic"
                label="SWIFT/BIC"
                disabled={isPending}
                required
                placeholder="BNPAFRPPXXX"
                formatDisplay={formatters.bic}
              />

              <InputTextField
                control={form.control}
                name="bank_name"
                label="Nom de la banque"
                disabled={isPending}
                required
                placeholder="Nom de votre banque"
              />

              <InputFileLarge
                control={form.control}
                name="logo"
                multiple={false}
                label={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.LABELS.LOGO)}
              />
            </div>

            {/* Section 2: Taux TVA et textes */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Taux de TVA</h2>

              <InputTextField
                control={form.control}
                name="tax_rate"
                label="%"
                disabled={isPending}
                required
                placeholder="19"
                formatDisplay={formatters.percentage}
              />

              <InputTextArea
                control={form.control}
                name="footer"
                label={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.LABELS.FOOTER)}
                disabled={isPending}
                required
                placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.PLACEHOLDERS.FOOTER)}
              />

              <InputTextArea
                control={form.control}
                name="legal_mentions"
                label={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.LABELS.LEGAL_MENTIONS)}
                disabled={isPending}
                required
                placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.PLACEHOLDERS.LEGAL_MENTIONS)}
              />
            </div>

            {/* Section 3: Prévisualisation */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Prévisualisation</h2>

              <Card className="bg-white shadow-lg border-2">
                <CardContent className="p-8 space-y-6">
                  {/* Header avec Logo */}
                  <div className="flex justify-between items-start pb-6 border-b-2 border-gray-200">
                    <div className="flex-1">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Logo" className="max-h-20 max-w-[200px] object-contain" />
                      ) : (
                        <div className="h-20 w-32 bg-gray-100 rounded flex items-center justify-center text-xs text-gray-400">
                          Votre logo
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <h1 className="text-2xl font-bold text-gray-800">FACTURE</h1>
                      <p className="text-sm text-gray-600 mt-1">N° FAC-2025-0001</p>
                    </div>
                  </div>

                  {/* Informations de facturation */}
                  <div className="grid grid-cols-2 gap-6 text-sm">
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Date de facture :</p>
                      <p className="text-gray-600">22/04/2025</p>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800 mb-1">Date d'échéance :</p>
                      <p className="text-gray-600">22/05/2025</p>
                    </div>
                  </div>

                  {/* Tableau des montants */}
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">Total HT :</span>
                      <span className="font-medium">{previewHT.toFixed(2)} DZD</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-700">TVA ({watchedValues.tax_rate || "0"}%) :</span>
                      <span className="font-medium">{previewTVA.toFixed(2)} DZD</span>
                    </div>
                    <div className="flex justify-between text-base font-bold pt-2 border-t border-gray-300">
                      <span>Total TTC :</span>
                      <span>{previewTTC.toFixed(2)} DZD</span>
                    </div>
                  </div>

                  {/* Informations bancaires */}
                  <div className="border-t pt-4 space-y-3">
                    <p className="font-semibold text-sm text-gray-800">Informations bancaires :</p>
                    <div className="text-xs text-gray-600 space-y-1">
                      <p>
                        <span className="font-medium">Banque :</span> {watchedValues.bank_name || "Nom de la banque"}
                      </p>
                      <p>
                        <span className="font-medium">IBAN :</span>{" "}
                        {watchedValues.iban || "FR76 XXXX XXXX XXXX XXXX XXXX XXX"}
                      </p>
                      <p>
                        <span className="font-medium">BIC :</span> {watchedValues.swift_bic || "BNPAFRPPXXX"}
                      </p>
                    </div>
                  </div>

                  {/* Footer */}
                  {watchedValues.footer && (
                    <div className="border-t pt-4">
                      <p className="text-xs text-gray-600 whitespace-pre-wrap">{watchedValues.footer}</p>
                    </div>
                  )}

                  {/* Mentions légales */}
                  {watchedValues.legal_mentions && (
                    <div className="border-t pt-4 bg-gray-50 -mx-8 -mb-8 px-8 py-4 rounded-b-lg">
                      <p className="text-xs text-gray-500 italic whitespace-pre-wrap">{watchedValues.legal_mentions}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <CustomButton
              type="submit"
              text={isPending ? "Enregistrement..." : "Sauvegarder"}
              disabled={isPending}
              className="bg-black text-white hover:bg-gray-800"
            />
          </div>
        </form>
      </Form>
    </>
  );
}

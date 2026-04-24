"use client";

import InputTextField from "@/components/custom-inputs/input-text";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { FormState } from "@/lib/definitions";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  BillingModelForm as BillingModelFormType,
  BillingModelFormSchema,
} from "@/schemas/bills/models/billing-model-form.schema";
import { Upload } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import CustomButton from "@/components/ui/custom-button";
import { BillingModel } from "@/schemas/bills/models/billing-model.schema";
import InputTextArea from "@/components/custom-inputs/input-textarea";

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
    defaultValues: initialData,
  });

  async function onSubmit(values: BillingModelFormType) {
    console.log("submitting");
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

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

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
              />

              <InputTextField
                control={form.control}
                name="swift_bic"
                label="SWIFT/BIC"
                disabled={isPending}
                required
                placeholder="BNPAFRPPXXX"
              />

              <InputTextField
                control={form.control}
                name="bank_name"
                label="Nom de la banque"
                disabled={isPending}
                required
                placeholder="Nom de votre banque"
              />

              <div className="pt-6">
                <h3 className="text-base font-semibold mb-4">Logo de l'agence</h3>
                <label className="block">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleLogoUpload}
                    disabled={isPending}
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-gray-400 transition-colors bg-gray-50">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo preview" className="max-h-32 mx-auto" />
                    ) : (
                      <>
                        <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          Glissez-déposez vous
                          <br />
                          cliquez pour importer
                        </p>
                      </>
                    )}
                  </div>
                </label>
              </div>
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
                label={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.LABELS.FOOTER)}
                disabled={isPending}
                required
                placeholder={translation(TRANSLATIONS_KEYS_2.SETTINGS.BILLS.MODELS.FORM.PLACEHOLDERS.FOOTER)}
              />
            </div>

            {/* Section 3: Prévisualisation */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold mb-4">Prévisualisation</h2>

              <Card className="bg-gray-50">
                <CardContent className="p-6 space-y-6">
                  <div className="text-sm text-gray-700 leading-relaxed">
                    <p className="font-semibold mb-2">Facture n° : FAC-2025-0001</p>
                    <p>Date de facture : 22/04/2025</p>
                    <p>Date d'échéance : 22/05/2025</p>
                    <p className="mt-4">Total HT : 1 000,00 €</p>
                    <p>TVA (19%) : 190,00 €</p>
                    <p className="font-semibold">Total TTC : 1 190,00 €</p>
                  </div>

                  <div className="border-t pt-4 text-xs text-gray-600">
                    <p className="font-semibold mb-2">Méthode de Paiement : Virement bancaire</p>
                    <p>Statut de Paiement : Payé le 25/04/2025 payé</p>
                    <p className="mt-4">Informations de l'Agence : Prénom/Nom</p>
                    <p>N° d'entreprise : 48 Rue de Rue, 48 8888</p>
                    <p>Siret n°Siret : N SIRET</p>
                  </div>
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

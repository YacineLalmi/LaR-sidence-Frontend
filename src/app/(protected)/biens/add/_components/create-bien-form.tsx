"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import GeneralInformation from "./general-information";
import Localisation from "./localisation";
import { Stepper, StepperStep } from "./stepper";
import TechnicalCharacteristics from "./technical-characteristics";
import AdditionalCharacteristics from "./additional-characteristics";
import Images from "./images";
import LinkedDocuments from "./linked-document";
import Exclusivity from "./exclusivity";
import Description from "./description";
import Commentaire from "./commentaire";
import { BienForm, BienFormInput, BienFormOutput, BienFormSchema } from "@/schemas/biens/bien-form.schema";
import { createBienAction } from "@/actions/Bien/create.action";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { Loader } from "lucide-react";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";

interface Props {
  bienTypes: ListItem[];
  transactionsTypes: ListItem[];
  status: ListItem[];
  wilayas: ListItem[];
  agents: ListItem[];
  priorities: ListItem[];
  clients: ListItem[];
  bienAdditionalcharacteristics: ListItem[];
  clientTypes: ListItem[];
  clientStatus: ListItem[];
  clientSources: ListItem[];
  civilities: ListItem[];
}
export default function CreateBienForm({
  agents,
  bienTypes,
  status,
  transactionsTypes,
  wilayas,
  priorities,
  bienAdditionalcharacteristics,
  clients,
  clientTypes,
  clientStatus,
  clientSources,
  civilities,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const translation = useTranslations();
  const router = useRouter();
  const form = useForm<BienFormInput, any, BienFormOutput>({
    resolver: zodResolver(BienFormSchema),
    defaultValues: {
      client_id: null,
      // title: "",
      bien_type_id: undefined,
      transaction_type_id: undefined,
      bien_status_id: undefined,
      agent_id: undefined,
      price: "",
      monthly_charges: "",
      wilaya_id: undefined,
      commune_id: undefined,
      priority_id: undefined,
      adresse: "",
      postal_code: "",
      coordinates: "",
      description: "",
      habitable_surface: "",
      total_surface: "",
      developed_surface: "",
      floor_number: "",
      bedrooms_number: "",
      rooms_number: "",
      bathrooms_number: "",
      availability_date: new Date(),
      additional_characteristics: [],
      images: [],
      comment: "",
      exclusivity: false,
      exclusivity_start: null,
      exclusivity_end: null,
      documents: [],
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: BienForm) {
    setIsPending(true);

    try {
      const response = await createBienAction(values);

      setIsPending(false);
      if (response.isOk) {
        router.push(NAVIGATION_KEYS.BIENS.ROOT);
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    }
    setIsPending(false);
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  const sampleSteps: StepperStep[] = [
    {
      id: 1,
      title: "Create Account",
    },
    {
      id: 2,
      title: "Verify Email",
    },
    {
      id: 3,
      title: "Complete Profile",
    },
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-12 gap-3">
        <div className="col-span-1 h-full">
          <Stepper steps={sampleSteps} activeStep={activeStep} />
        </div>
        {activeStep === 1 && (
          <div className="col-span-11 grid grid-cols-2 gap-5">
            <GeneralInformation
              clients={clients}
              agents={agents}
              status={status}
              bienTypes={bienTypes}
              form={form}
              transactionsTypes={transactionsTypes}
              isPending={isPending}
              clientTypes={clientTypes}
              clientStatus={clientStatus}
              clientSources={clientSources}
              civilities={civilities}
            />
            <div>
              <Localisation form={form} wilayas={wilayas} />
              <Description form={form} isPending={isPending} />
            </div>
          </div>
        )}
        {activeStep === 2 && (
          <div className="col-span-11 grid grid-cols-2 gap-5">
            <TechnicalCharacteristics form={form} isPending={isPending} />
            <div>
              <AdditionalCharacteristics
                form={form}
                isPending={isPending}
                bienAdditionalcharacteristics={bienAdditionalcharacteristics}
              />
              <Images form={form} isPending={isPending} />
            </div>
          </div>
        )}
        {activeStep === 3 && (
          <div className="col-span-11 grid grid-cols-2 gap-5">
            <div>
              <LinkedDocuments form={form} isPending={isPending} />
              <Exclusivity form={form} isPending={isPending} priorities={priorities} />
            </div>
            <Commentaire form={form} isPending={isPending} />
          </div>
        )}

        <div className="col-span-12 flex justify-end">
          {activeStep > 1 && (
            <Button
              type="button"
              className="border-1 cursor-pointer w-52 p-5"
              onClick={() => setActiveStep((prev) => prev - 1)}
            >
              {translation(TRANSLATIONS_KEYS.COMMON.PREVIOUS)}
            </Button>
          )}
          {activeStep < sampleSteps.length && (
            <Button
              type="button"
              className="border-1 cursor-pointer w-52 p-5"
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              {translation(TRANSLATIONS_KEYS.COMMON.NEXT)}
            </Button>
          )}
          {activeStep === sampleSteps.length && (
            <Button className="border-1 cursor-pointer w-52 p-5" type="submit" disabled={isPending}>
              {isPending ? (
                <span className="flex gap-1">
                  <Loader className="animate-spin" /> {translation(TRANSLATIONS_KEYS.COMMON.SUBMIT)}
                </span>
              ) : (
                translation(TRANSLATIONS_KEYS.COMMON.SUBMIT)
              )}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

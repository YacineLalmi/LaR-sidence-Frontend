"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
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
import { BienForm, BienFormSchema } from "@/schemas/biens/bien-form.schema";
import { createBienAction } from "@/actions/Bien/create.action";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { Loader } from "lucide-react";

interface Props {
  bienTypes: ListItem[];
  transactionsTypes: ListItem[];
  status: ListItem[];
  wilayas: ListItem[];
  agents: ListItem[];
  priorities: ListItem[];
  clients: ListItem[];
  bienAdditionalcharacteristics: ListItem[];
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
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const translation = useTranslations();
  const router = useRouter();
  const form = useForm<BienForm>({
    resolver: zodResolver(BienFormSchema),
    mode: "onChange",
    defaultValues: {
      client_id: undefined,
      title: "",
      bien_type_id: undefined,
      transaction_type_id: undefined,
      bien_status_id: undefined,
      agent_id: undefined,
      price: 0,
      monthly_charges: 0,
      wilaya_id: undefined,
      commune_id: undefined,
      priority_id: undefined,
      adresse: "",
      postal_code: "",
      coordinates: "",
      description: "",
      habitable_surface: 0,
      total_surface: 0,
      developed_surface: 0,
      floor_number: 0,
      bedrooms_number: 0,
      rooms_number: 0,
      bathrooms_number: 0,
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
    console.log("Form values:", values);
    try {
      const response = await createBienAction(values);
      console.log("Response:", response);
      setIsPending(false);
      if (response.isOk) {
        router.push("/biens");
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

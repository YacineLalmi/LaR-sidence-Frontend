"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/Global.schema";
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

interface Props {
  bienTypes: ListItem[];
  transactionsTypes: ListItem[];
  status: ListItem[];
  wilayas: ListItem[];
  agents: ListItem[];
  priorities: ListItem[];
}
export default function AddBienForm({ agents, bienTypes, status, transactionsTypes, wilayas, priorities }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const t = useTranslations();
  const router = useRouter();
  const form = useForm<BienForm>({
    resolver: zodResolver(BienFormSchema),
    mode: "onChange",
    defaultValues: {
      title: "",
      bien_type_id: undefined,
      transaction_type_id: undefined,
      status_id: undefined,
      agent_id: undefined,
      price: 0,
      monthly_charges: 0,

      wilaya_id: undefined,
      commune_id: undefined,
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

      addtional_characteristics: [],

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
    console.log(values);
    try {
      const response = await createBienAction(values);
      console.log("resposnesss", response)
      setIsPending(false);
      if (response.isOk) {
        router.push("/biens");
        customToast.success(t("loginSuccess"));
      } else customToast.error(response.errorMessage || t("loginFailed"));
    } catch (error) {
      customToast.error(t("loginFailed"));
    }
  }

  function onError(errors: any) {
    for (const key in errors) {
      if (!Object.hasOwn(errors, key)) continue;
      customToast.error(errors[key]?.message);
    }
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
      <form onSubmit={form.handleSubmit(onSubmit, onError)} className="grid grid-cols-12 gap-3">
        <div className="col-span-1 h-full">
          <Stepper steps={sampleSteps} activeStep={activeStep} />
        </div>
        {activeStep === 1 && (
          <div className="col-span-11 grid grid-cols-2 gap-5">
            <GeneralInformation
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
              <AdditionalCharacteristics form={form} isPending={isPending} />
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
              {t("common.previous")}
            </Button>
          )}
          {activeStep < sampleSteps.length && (
            <Button
              type="button"
              className="border-1 cursor-pointer w-52 p-5"
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              {t("common.next")}
            </Button>
          )}
          {activeStep === sampleSteps.length && (
            <Button className="border-1 cursor-pointer w-52 p-5" type="submit">
              {t("common.submit")}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

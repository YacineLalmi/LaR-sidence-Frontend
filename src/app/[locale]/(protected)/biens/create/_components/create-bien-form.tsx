"use client";

import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
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
import { createBienAction } from "@/actions/Bien/create-bien.action";
import { Loader } from "lucide-react";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import CreateClientDialog from "@/app/[locale]/(protected)/clients/_components/create-client-dialog";
import { ListItem } from "@/schemas/global.schema";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import { Client } from "@/schemas/clients/client.schema";

export default function CreateBienForm() {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);

  const [isClientDialogOpen, setIsClientDialogOpen] = useState<boolean>(false);
  const [clients, setClients] = useState<ListItem[]>([]);
  const [isClientsPending, startClientsTransition] = useTransition();

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
      postal_code: null,
      coordinates: "",
      description: "",
      total_surface: "",
      habitable_surface: null,
      developed_surface: null,
      floor_number: "",
      bedrooms_number: "",
      rooms_number: "",
      bathrooms_number: "",
      availability_date: new Date(),
      characteristics: [],
      images: [],
      comment: "",
      exclusivity: false,
      exclusivity_start: null,
      exclusivity_end: null,
      documents: [],
    },
  });

  useEffect(() => {
    startClientsTransition(async () => {
      try {
        const results = await getClientListAction();
        setClients(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setClients([]);
      }
    });
  }, []);
  // 2. Define a submit handler.
  async function onSubmit(values: BienForm) {
    setIsPending(true);

    try {
      const response = await createBienAction(values);

      setIsPending(false);
      if (response.isOk) {
        router.push(ROUTES.BIENS.ROOT);
        customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
      } else
        customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
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

  const handleClientCreated = (client: Client) => {
    // Refresh the clients list
    setIsClientDialogOpen(false);
    startClientsTransition(async () => {
      try {
        const results = await getClientListAction();
        setClients(results);
        // Set the newly created client as selected
        form.setValue("client_id", client.id);
        // Show success message
        customToast.success(
          `${translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.MESSAGES.CREATED)} - ${client.first_name} ${client.last_name}`,
        );
      } catch (error) {
        console.error("Failed to fetch options:", error);
      }
    });
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="grid grid-cols-12 gap-3">
          <div className="col-span-1 h-full">
            <Stepper steps={sampleSteps} activeStep={activeStep} />
          </div>
          {activeStep === 1 && (
            <div className="col-span-11 grid grid-cols-2 gap-5">
              <GeneralInformation
                form={form}
                isPending={isPending}
                setIsClientDialogOpen={setIsClientDialogOpen}
                clients={clients}
                isClientsPending={isClientsPending}
              />
              <div>
                <Localisation form={form} />
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
                <Exclusivity form={form} isPending={isPending} />
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
                {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.PREVIOUS)}
              </Button>
            )}
            {activeStep < sampleSteps.length && (
              <Button
                type="button"
                className="border-1 cursor-pointer w-52 p-5"
                onClick={() => setActiveStep((prev) => prev + 1)}
              >
                {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.NEXT)}
              </Button>
            )}
            {activeStep === sampleSteps.length && (
              <Button className="border-1 cursor-pointer w-52 p-5" type="submit" disabled={isPending}>
                {isPending ? (
                  <span className="flex gap-1">
                    <Loader className="animate-spin" /> {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT)}
                  </span>
                ) : (
                  translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT)
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
      <CreateClientDialog
        open={isClientDialogOpen}
        onOpenChange={setIsClientDialogOpen}
        onClientCreated={handleClientCreated}
      />
    </>
  );
}

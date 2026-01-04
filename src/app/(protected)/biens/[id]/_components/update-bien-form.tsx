"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast, fetchFileAsFileObject } from "@/lib/utils";
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
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { Bien } from "@/schemas/biens/bien.schema";
import { getFileBlob } from "@/actions/files/get-file-blob.action";
import { updateBienAction } from "@/actions/Bien/update.action";

interface Props {
  bien: Bien;
  bienTypes: ListItem[];
  transactionsTypes: ListItem[];
  status: ListItem[];
  wilayas: ListItem[];
  agents: ListItem[];
  priorities: ListItem[];
  clients: ListItem[];
  bienAdditionalcharacteristics: ListItem[];
}

export default function UpdateBienForm({
  bien,
  agents,
  bienTypes,
  status,
  transactionsTypes,
  wilayas,
  priorities,
  clients,
  bienAdditionalcharacteristics,
}: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(true);

  const commonTranslation = useTranslations();
  const router = useRouter();
  const form = useForm<BienForm>({
    resolver: zodResolver(BienFormSchema),
    mode: "onChange",
    defaultValues: {
      client_id: bien.client.id.toString(),
      title: bien.title,
      bien_type_id: bien.bien_type.id.toString(),
      transaction_type_id: bien.transaction_type.id.toString(),
      bien_status_id: bien.bien_status.id.toString(),
      agent_id: bien.agent.id.toString(),
      price: bien.price,
      monthly_charges: bien.monthly_charges,
      wilaya_id: bien.wilaya.id.toString(),
      commune_id: bien.commune.id.toString(),
      priority_id: bien.priority.id?.toString(),
      adresse: bien.adresse,
      postal_code: bien.postal_code,
      coordinates: bien.coordinates,
      description: bien.description,
      habitable_surface: bien.habitable_surface,
      total_surface: bien.total_surface,
      developed_surface: bien.developed_surface,
      floor_number: bien.floor_number,
      bedrooms_number: bien.bedrooms_number,
      rooms_number: bien.rooms_number,
      bathrooms_number: bien.bathrooms_number,
      availability_date: new Date(bien.availability_date),
      addtional_characteristics: bien.additional_characteristics.map((item) => item.id),
      images: [],
      comment: bien.comment,
      exclusivity: bien.exclusivity,
      exclusivity_start: bien.exclusivity_start ? new Date(bien.exclusivity_start) : null,
      exclusivity_end: bien.exclusivity_end ? new Date(bien.exclusivity_end) : null,
      documents: [],
    },
  });

  // Load existing files and convert them to File objects
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoadingFiles(true);
      try {
        // Fetch images
        const imagePromises = bien.images.map((img) => fetchFileAsFileObject(img.id, img.original_name, img.mime_type));
        const images = await Promise.all(imagePromises);
        const validImages = images.filter((img): img is File => img !== null);

        // Fetch documents
        const documentPromises = bien.documents.map((doc) =>
          fetchFileAsFileObject(doc.id, doc.original_name, doc.mime_type)
        );
        const documents = await Promise.all(documentPromises);
        const validDocuments = documents.filter((doc): doc is File => doc !== null);

        console.log("fetched images", validImages);
        // Set form values with File objects
        form.setValue("images", validImages as any);
        form.setValue("documents", validDocuments as any);
      } catch (error) {
        console.error("Error loading files:", error);
        customToast.error(commonTranslation("errors.loadingfiles"));
      } finally {
        setIsLoadingFiles(false);
      }
    };

    loadFiles();
  }, [bien.images, bien.documents]);

  // 2. Define a submit handler.
  async function onSubmit(values: BienForm) {
    setIsPending(true);
    console.log("Form values:", values);
    try {
      const response = await updateBienAction(values, bien.id);
      console.log("Response:", response);
      setIsPending(false);
      if (response.isOk) {
        router.push("/biens");
        customToast.success(commonTranslation("success.operationcompleted"));
      } else customToast.error(response.errorMessage || commonTranslation("errors.somethingwrong"));
    } catch (error) {
      console.log(error);
      customToast.error(commonTranslation("errors.somethingwrong"));
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

  if (isLoadingFiles) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">{commonTranslation("loading")}</p>
        </div>
      </div>
    );
  }

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
              {commonTranslation("previous")}
            </Button>
          )}
          {activeStep < sampleSteps.length && (
            <Button
              type="button"
              className="border-1 cursor-pointer w-52 p-5"
              onClick={() => setActiveStep((prev) => prev + 1)}
            >
              {commonTranslation("next")}
            </Button>
          )}
          {activeStep === sampleSteps.length && (
            <Button className="border-1 cursor-pointer w-52 p-5" type="submit" disabled={isPending}>
              {commonTranslation("submit")}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}

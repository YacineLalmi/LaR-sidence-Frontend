"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { customToast, fetchFileAsFileObject } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import Localisation from "../../create/_components/localisation";
import { Stepper, StepperStep } from "./stepper";
import { BienForm, BienFormInput, BienFormOutput, BienFormSchema } from "@/schemas/biens/bien-form.schema";
import { Bien } from "@/schemas/biens/bien.schema";
import LinkedDocuments from "../../create/_components/linked-document";
import { updateBienAction } from "@/actions/Bien/update-bien.action";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { ROUTES } from "@/constants/routes";
import GeneralInformation from "../../create/_components/general-information";
import Description from "../../create/_components/description";
import TechnicalCharacteristics from "../../create/_components/technical-characteristics";
import AdditionalCharacteristics from "../../create/_components/additional-characteristics";
import Images from "../../create/_components/images";
import Exclusivity from "../../create/_components/exclusivity";
import Commentaire from "../../create/_components/commentaire";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import { Client } from "@/schemas/clients/client.schema";
import CreateClientDialog from "@/app/[locale]/(protected)/clients/_components/create-client-dialog";
import { getMediaAsBlobAction } from "@/actions/media/get-media.actions";

interface Props {
  bien: Bien;
}

export default function UpdateBienForm({ bien }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isLoadingFiles, setIsLoadingFiles] = useState<boolean>(true);
  const [existingImages, setExistingImages] = useState<File[]>([]);
  const [existingDocuments, setExistingDocuments] = useState<File[]>([]);

  const [isClientDialogOpen, setIsClientDialogOpen] = useState<boolean>(false);
  const [clients, setClients] = useState<ListItem[]>([]);
  const [isClientsPending, startClientsTransition] = useTransition();

  const translation = useTranslations();
  const router = useRouter();
  const form = useForm<BienFormInput, null, BienFormOutput>({
    resolver: zodResolver(BienFormSchema),
    mode: "onTouched",
    defaultValues: {
      client_id: bien.client?.id.toString(),
      // title: bien.title,
      bien_type_id: bien.type?.id.toString(),
      transaction_type_id: bien.transaction_type?.id.toString(),
      bien_status_id: bien.status?.id.toString(),
      agent_id: bien.agent?.id.toString(),
      price: bien?.price?.toString(),
      monthly_charges: (bien.monthly_charges && bien.monthly_charges.toString()) || "",
      wilaya_id: bien.wilaya?.id.toString(),
      commune_id: bien.commune?.id.toString(),
      adresse: bien.adresse,
      postal_code: bien.postal_code,
      coordinates: bien.coordinates,
      description: bien.description || "",
      habitable_surface: (bien.habitable_surface && bien.habitable_surface.toString()) || null,
      total_surface: bien.total_surface.toString(),
      developed_surface: (bien.developed_surface && bien.developed_surface.toString()) || "",
      floor_number: (bien.floor_number && bien.floor_number.toString()) || null,
      bedrooms_number: (bien.bedrooms_number && bien.bedrooms_number.toString()) || null,
      rooms_number: (bien.rooms_number && bien.rooms_number.toString()) || null,
      bathrooms_number: (bien.bathrooms_number && bien.bathrooms_number.toString()) || null,
      availability_date: new Date(bien.availability_date),
      characteristics: bien.characteristics?.map((item) => +item.id) || [],
      comment: bien.comment || "",
      exclusivity: bien.exclusivity,
      exclusivity_start: bien.exclusivity_start ? new Date(bien.exclusivity_start) : null,
      exclusivity_end: bien.exclusivity_end ? new Date(bien.exclusivity_end) : null,
      new_images: [],
      new_documents: [],
      deleted_images: [],
      deleted_documents: [],
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

  // Load existing files and convert them to File objects
  useEffect(() => {
    const loadFiles = async () => {
      setIsLoadingFiles(true);
      try {
        // Fetch images
        const imagePromises = bien.images?.map((img) => getMediaAsBlobAction(img)) || [];
        const images = await Promise.all(imagePromises);
        const validImages = images
          .filter((img) => !!img)
          .map((img) => {
            const binaryString = window.atob(img.base64);
            const bytes = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            return new File([bytes], img.name + "#" + img.uuid, { type: img.mimeType });
          });

        // Fetch documents
        const documentPromises = bien.documents?.map((doc) => getMediaAsBlobAction(doc)) || [];
        const documents = await Promise.all(documentPromises);
        const validDocuments = documents
          .filter((doc) => !!doc)
          .map((doc) => {
            const binaryString = window.atob(doc.base64);
            const bytes = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            return new File([bytes], doc.name + "#" + doc.uuid, { type: doc.mimeType });
          });

        // Set form values with File objects
        setExistingImages(validImages);
        setExistingDocuments(validDocuments);
      } catch (error) {
        console.error("Error loading files:", error);
        customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.LOADING_FILE_FAILED));
      } finally {
        setIsLoadingFiles(false);
      }
    };

    loadFiles();
  }, [bien.images, bien.documents]);

  // 2. Define a submit handler.
  async function onSubmit(values: BienForm) {
    setIsPending(true);
    try {
      const response = await updateBienAction(values, bien.id);
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
                <Images
                  form={form}
                  isPending={isPending || isLoadingFiles}
                  existingImages={existingImages}
                  setExistingImages={setExistingImages}
                />
              </div>
            </div>
          )}
          {activeStep === 3 && (
            <div className="col-span-11 grid grid-cols-2 gap-5">
              <div>
                <LinkedDocuments
                  form={form}
                  isPending={isPending || isLoadingFiles}
                  existingDocuments={existingDocuments}
                  setExistingDocuments={setExistingDocuments}
                />
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
                {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT)}
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

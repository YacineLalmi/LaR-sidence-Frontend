"use client";

import { getBienListAction } from "@/actions/Bien/get-biens-list.action";
import { getClassificationsListAction } from "@/actions/classification/get-classifications-list.action";
import { getClientListAction } from "@/actions/clients/get-client-list.action";
import { createOfferAction } from "@/actions/offers/create-offer.action";
import { updateOfferAction } from "@/actions/offers/update-offer.action";
import CreateClientDialog from "@/app/(protected)/clients/_components/create-client-dialog";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ROUTES } from "@/constants/routes";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";
import { customToast } from "@/lib/utils";
import { Client } from "@/schemas/clients/client.schema";
import { ListItem } from "@/schemas/global.schema";
import { OfferForm, OfferFormSchema } from "@/schemas/offers/offer-form.schema";
import { Offer } from "@/schemas/offers/offer.schema";
import { CATEGORIES, SCOPES } from "@/services/classification.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";

interface Props {
  offer: Offer;
}
export default function UpdateOfferForm({ offer }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);

  const router = useRouter();
  const translation = useTranslations();

  const [types, setTypes] = useState<ListItem[]>([]);
  const [statuses, setStatuses] = useState<ListItem[]>([]);
  const [biens, setBiens] = useState<ListItem[]>([]);
  const [clients, setClients] = useState<ListItem[]>([]);
  const [isTypesPending, startTypesTransition] = useTransition();
  const [isStatusesPending, startStatusesTransition] = useTransition();
  const [isBiensPending, startBiensTransition] = useTransition();
  const [isClientsPending, startClientsTransition] = useTransition();

  // fetching types
  useEffect(() => {
    startTypesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.TYPE, SCOPES.OFFER);
        setTypes(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setTypes([]);
      }
    });

    startStatusesTransition(async () => {
      try {
        const results = await getClassificationsListAction(CATEGORIES.STATUS, SCOPES.OFFER);
        setStatuses(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setStatuses([]);
      }
    });

    startBiensTransition(async () => {
      try {
        const results = await getBienListAction();
        setBiens(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setBiens([]);
      }
    });

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

  const form = useForm<OfferForm>({
    resolver: zodResolver(OfferFormSchema),
    defaultValues: {
      bien_id: offer.bien?.id.toString(),
      client_id: offer.client?.id.toString(),
      status_id: offer.status?.id.toString(),
      type_id: offer.type?.id.toString(),
      proposed_price: offer.proposed_price.toString(),
      conditions: offer.conditions,
      comment: offer.comment,
    },
  });

  async function onSubmit(values: OfferForm) {
    setIsPending(true);

    try {
      const response = await updateOfferAction(values, offer.id);
      setIsPending(false);
      if (response.isOk) {
        router.push(ROUTES.OFFERS.ROOT);
        customToast.success(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.OPERATION_COMPLETED));
      } else
        customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.SOMETHING_WRONG));
    }
  }
  const handleClientCreated = (client: Client) => {
    // Refresh the clients list
    setIsClientModalOpen(false);
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
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 grid grid-cols-2 gap-5">
          <div className="grid grid-cols-1 gap-3">
            <InputSelectField
              control={form.control}
              name="bien_id"
              label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.BIEN)}
              placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.BIEN)}
              options={biens}
              isPending={isBiensPending}
              required
            />

            {/* Client Select with Create Button beside it */}
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <InputSelectField
                  control={form.control}
                  name="client_id"
                  label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.CLIENT)}
                  placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.CLIENT)}
                  options={clients}
                  isPending={isClientsPending}
                  required
                />
              </div>

              <Button
                type="button"
                variant="default"
                size="icon"
                onClick={() => setIsClientModalOpen(true)}
                className="h-10 w-10 shrink-0 cursor-pointer"
                title={translation(TRANSLATIONS_KEYS_2.CLIENTS.FORM.BUTTONS.CREATE)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <InputSelectField
              control={form.control}
              name="type_id"
              label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.TYPE)}
              placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.TYPE)}
              options={types}
              isPending={isTypesPending}
              required
            />
            <InputSelectField
              control={form.control}
              name="status_id"
              label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.STATUS)}
              placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.STATUS)}
              options={statuses}
              isPending={isStatusesPending}
              required
            />
            <InputTextField
              control={form.control}
              name="proposed_price"
              label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.PROPOSED_PRICE)}
              placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.PLACEHOLDERS.PROPOSED_PRICE)}
              disabled={isPending}
              required
            />
          </div>
          <div>
            <InputTextArea
              control={form.control}
              name="conditions"
              label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.CONDITIONS)}
              disabled={isPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.CONDITIONS)}
            />
            <InputTextArea
              control={form.control}
              name="comment"
              label={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.COMMENT)}
              disabled={isPending}
              placeholder={translation(TRANSLATIONS_KEYS_2.OFFERS.FORM.LABELS.COMMENT)}
            />
          </div>
          <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
            {translation(TRANSLATIONS_KEYS_2.COMMON.BUTTONS.SUBMIT)}
          </Button>
        </form>
      </Form>
      <CreateClientDialog
        open={isClientModalOpen}
        onOpenChange={setIsClientModalOpen}
        onClientCreated={handleClientCreated}
      />
    </>
  );
}

"use client";

import { createOfferAction } from "@/actions/offers/create.action";
import { updateOfferAction } from "@/actions/offers/update.action";
import InputSelectField from "@/components/custom-inputs/input-select";
import InputTextField from "@/components/custom-inputs/input-text";
import InputTextArea from "@/components/custom-inputs/input-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";
import { NAVIGATION_KEYS } from "@/lib/navigation-constants";
import { customToast } from "@/lib/utils";
import { ListItem } from "@/schemas/global.schema";
import { OfferForm, OfferFormSchema } from "@/schemas/offers/offer-form.schema";
import { Offer } from "@/schemas/offers/offer.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useForm } from "react-hook-form";

interface Props {
  types: ListItem[];
  status: ListItem[];
  clients: ListItem[];
  biens: ListItem[];
  offer: Offer;
}
export default function UpfateOfferForm({ types, status, biens, clients, offer }: Props) {
  const [isPending, setIsPending] = useState<boolean>(false);

  const router = useRouter();
  const translation = useTranslations();

  const form = useForm<OfferForm>({
    resolver: zodResolver(OfferFormSchema),
    defaultValues: {
      bien_id: offer.bien.id.toString(),
      client_id: offer.client.id.toString(),
      status_id: offer.status.id.toString(),
      type_id: offer.type.id.toString(),
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
        router.push(NAVIGATION_KEYS.OFFERS.ROOT);
        customToast.success(translation(TRANSLATIONS_KEYS.COMMON.SUCCESS.OPERATION_COMPLETED));
      } else customToast.error(response.errorMessage || translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    } catch (error) {
      customToast.error(translation(TRANSLATIONS_KEYS.COMMON.ERRORS.SOMETHING_WRONG));
    }
  }

  async function onInvalid(values: any) {
    const [field, error] = Object.entries(values)[0] as [string, { message: string }];
    customToast.error(`${field}: ${error.message}`);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit, onInvalid)} className="space-y-8 grid grid-cols-2 gap-5">
        <div className="grid grid-cols-1 gap-3">
          <InputSelectField
            control={form.control}
            name="bien_id"
            label={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.BIEN)}
            options={biens}
            placeholder={translation(TRANSLATIONS_KEYS.OFFERS.FORM.PLACEHOLDER.BIEN)}
            disabled={isPending}
            required
          />
          <InputSelectField
            control={form.control}
            name="client_id"
            label={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.CLIENT)}
            options={clients}
            placeholder={translation(TRANSLATIONS_KEYS.OFFERS.FORM.PLACEHOLDER.CLIENT)}
            disabled={isPending}
            required
          />
          <InputSelectField
            control={form.control}
            name="type_id"
            label={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.TYPE)}
            options={types}
            placeholder={translation(TRANSLATIONS_KEYS.OFFERS.FORM.PLACEHOLDER.TYPE)}
            disabled={isPending}
            required
          />
          <InputSelectField
            control={form.control}
            name="status_id"
            label={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.STATUS)}
            options={status}
            placeholder={translation(TRANSLATIONS_KEYS.OFFERS.FORM.PLACEHOLDER.STATUS)}
            disabled={isPending}
            required
          />
          <InputTextField
            control={form.control}
            name="proposed_price"
            label={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.PROPOSED_PRICE)}
            placeholder={translation(TRANSLATIONS_KEYS.OFFERS.FORM.PLACEHOLDER.PROPOSED_PRICE)}
            disabled={isPending}
            required
          />
        </div>
        <div>
          <InputTextArea
            control={form.control}
            name="conditions"
            label={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.COMDITIONS)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.COMDITIONS)}
          />
          <InputTextArea
            control={form.control}
            name="comment"
            label={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.COMMENT)}
            disabled={isPending}
            required
            placeholder={translation(TRANSLATIONS_KEYS.OFFERS.FORM.LABEL.COMMENT)}
          />
        </div>
        <Button className="border-1 cursor-pointer w-52 p-5 col-span-3 ml-auto" type="submit">
          {translation(TRANSLATIONS_KEYS.COMMON.SUBMIT)}
        </Button>
      </form>
    </Form>
  );
}

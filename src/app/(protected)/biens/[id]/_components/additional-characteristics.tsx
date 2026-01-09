"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
  bienAdditionalcharacteristics: ListItem[];
}

export default function AdditionalCharacteristics({ form, isPending = false, bienAdditionalcharacteristics }: Props) {
  const translation = useTranslations();
  console.log("ad car", form.getValues("additional_characteristics"));
  return (
    <Section header={translation(TRANSLATIONS_KEYS.BIENS.FORM.ADDITIONAL_CHARACTERISTICS)}>
      <div className="space-y-4 grid grid-cols-3">
        {bienAdditionalcharacteristics.map((feature) => (
          <FormField
            key={feature.id}
            control={form.control}
            name="additional_characteristics"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(+feature.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, +feature.id])
                        : field.onChange(field.value?.filter((value) => value !== +feature.id));
                    }}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary  rounded-full p-0.5 h-5 w-5"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">{feature.name}</FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </Section>
  );
}

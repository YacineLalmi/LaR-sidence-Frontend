"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import { Control, UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienFormInput, BienFormOutput } from "@/schemas/biens/bien-form.schema";
import { ListItem } from "@/schemas/global.schema";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

interface Props {
  form: UseFormReturn<BienFormInput, any, BienFormOutput>;
  isPending?: boolean;
  bienCharacteristics: ListItem[];
}

export default function AdditionalCharacteristics({ form, isPending = false, bienCharacteristics }: Props) {
  const translation = useTranslations();

  console.log(form.watch("characteristics"));
  return (
    <Section header={translation(TRANSLATIONS_KEYS_2.BIENS.FORM.TITLES.SECTIONS.ADDITIONAL_CHARACTERISTICS)}>
      <div className="space-y-4 grid grid-cols-3">
        {bienCharacteristics.map((feature) => (
          <FormField
            key={feature.id}
            control={form.control as Control<BienFormInput, any, any>}
            name="characteristics"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(+feature.id)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, +feature.id])
                        : field.onChange(field.value?.filter((value: number) => value !== +feature.id));
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

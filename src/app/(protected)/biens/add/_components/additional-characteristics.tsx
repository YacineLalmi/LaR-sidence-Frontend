"use client";

import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useTranslations } from "next-intl";
import React from "react";
import { UseFormReturn } from "react-hook-form";
import Section from "./section";
import { BienForm } from "@/schemas/biens/bien-form.schema";

interface Props {
  form: UseFormReturn<BienForm>;
  isPending?: boolean;
}


export default function AdditionalCharacteristics({ form, isPending = false }: Props) {
  const columnFeatures = [
    { key: 1, label: "Balcon" },
    { key: 2, label: "Piscine" },
    { key: 3, label: "Gardien" },
    { key: 4, label: "Meublé" },
    { key: 5, label: "Balcon" },
    { key: 6, label: "Piscine" },
    { key: 7, label: "Gardien" },
    { key: 8, label: "Meublé" },
  ];

  const t = useTranslations();
  return (
    <Section header={t("biens.create.form.additionalCharacteristics.header")}>
      <div className="space-y-4 grid grid-cols-3">
        {columnFeatures.map((feature) => (
          <FormField
            key={feature.key}
            control={form.control}
            name="addtional_characteristics"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value?.includes(feature.key)}
                    onCheckedChange={(checked) => {
                      return checked
                        ? field.onChange([...field.value, feature.key])
                        : field.onChange(field.value?.filter((value) => value !== feature.key));
                    }}
                    className="data-[state=checked]:bg-primary data-[state=checked]:border-primary  rounded-full p-0.5 h-5 w-5"
                  />
                </FormControl>
                <FormLabel className="text-sm font-normal cursor-pointer">{feature.label}</FormLabel>
              </FormItem>
            )}
          />
        ))}
      </div>
    </Section>
  );
}

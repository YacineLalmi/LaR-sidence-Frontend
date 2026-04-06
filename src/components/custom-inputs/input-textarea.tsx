"use client";

import React from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  errorInside?: boolean; // Ajout de la prop pour la cohérence
};

export default function InputTextArea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  className,
  errorInside = false,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full gap-[12px]", errorInside ? "relative" : "")}>
          {!!label && (
            <FormLabel className="text-xs md:text-sm lg:text-base">
              {label} <span className={cn("text-[16px]", required ? "text-red-500" : "text-transparent")}>*</span>
            </FormLabel>
          )}

          <FormControl>
            <div className="relative">
              <Textarea
                disabled={disabled}
                placeholder={placeholder || "Enter a description..."}
                className={cn(
                  "resize-none",
                  errorInside && "pb-8", // Espace en bas si l'erreur est dedans
                  className,
                )}
                rows={rows} // Utilisation de la prop dynamique
                {...field}
              />

              {/* Message d'erreur à l'intérieur (en bas à droite du textarea) */}
              {errorInside && (
                <div className="absolute right-3 bottom-2">
                  <FormMessage className="text-[10px] font-medium leading-none" />
                </div>
              )}
            </div>
          </FormControl>

          {/* Message d'erreur classique en dessous */}
          {!errorInside && <FormMessage />}
        </FormItem>
      )}
    />
  );
}

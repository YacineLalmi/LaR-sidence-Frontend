"use client";
import React from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  form?: UseFormReturn<any>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;
  RightIconOnClick?: () => any;
  className?: string;
  errorInside?: boolean;
  formatDisplay?: (value: string) => string; // Function to format display
  formatValue?: (value: string) => string; // Function to format stored value
  type?: string; // Input type
};

// Predefined formatters
export const formatters = {
  iban: (value: string) => {
    // Remove all non-alphanumeric characters
    const cleaned = value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
    // Format as XXXX XXXX XXXX XXXX...
    return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
  },

  ibanValue: (value: string) => {
    // Remove spaces for storage
    return value.replace(/\s/g, "").toUpperCase();
  },

  creditCard: (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    return cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
  },

  creditCardValue: (value: string) => {
    return value.replace(/\s/g, "");
  },

  phone: (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    // Format as XX XX XX XX XX (French format)
    const match = cleaned.match(/^(\d{2})(\d{2})(\d{2})(\d{2})(\d{2})$/);
    if (match) {
      return `${match[1]} ${match[2]} ${match[3]} ${match[4]} ${match[5]}`;
    }
    return cleaned;
  },

  phoneValue: (value: string) => {
    return value.replace(/\s/g, "");
  },

  bic: (value: string) => {
    return value.replace(/[^A-Z0-9]/gi, "").toUpperCase();
  },

  currency: (value: string) => {
    const cleaned = value.replace(/[^\d.,]/g, "");
    return cleaned;
  },

  percentage: (value: string) => {
    const cleaned = value.replace(/[^\d.,]/g, "");
    return cleaned;
  },
};

export default function InputTextField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  LeftIcon,
  RightIcon,
  RightIconOnClick,
  className,
  errorInside = false,
  formatDisplay,
  formatValue,
  type = "text",
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
              {LeftIcon && (
                <LeftIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}

              <Input
                disabled={disabled}
                placeholder={placeholder}
                type={type}
                className={cn(!!LeftIcon && "pl-8", !!RightIcon && "pr-8", errorInside && "pr-10", className)}
                value={formatDisplay ? formatDisplay(field.value || "") : field.value || ""}
                onChange={(e) => {
                  const rawValue = e.target.value;
                  const formattedValue = formatValue ? formatValue(rawValue) : rawValue;
                  field.onChange(formattedValue);
                }}
                onBlur={field.onBlur}
                name={field.name}
                ref={field.ref}
              />

              {RightIcon && (
                <RightIcon
                  className={cn(
                    "absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground",
                    RightIconOnClick && "cursor-pointer",
                  )}
                  onClick={RightIconOnClick}
                />
              )}

              {/* Error Message INSIDE the input container */}
              {errorInside && (
                <div className="absolute right-2 top-1/2 -translate-y-1/2">
                  <FormMessage className="text-[10px] font-medium leading-none" />
                </div>
              )}
            </div>
          </FormControl>

          {/* Error Message UNDER the input container */}
          {!errorInside && <FormMessage />}
        </FormItem>
      )}
    />
  );
}

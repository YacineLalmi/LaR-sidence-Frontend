"use client";

import * as React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar1 } from "lucide-react";
import { useTranslations } from "next-intl";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function InputRangeField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  className,
}: InputFieldProps<T>) {
  const t = useTranslations();
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="grow-1">
          {!!label && (
            <FormLabel>
              {label}{" "}
              <span className={cn(" text-xl", required ? "text-red-500" : "text-transparent", className)}>*</span>
            </FormLabel>
          )}
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  className={cn(
                    "relative p-4 rounded-full justify-start text-left font-normal bg-transparent border-gray-700",
                    !field.value ? "text-muted-foreground" : ""
                  )}
                >
                  {field.value.from ? (
                    field.value.to ? (
                      <>
                        {format(field.value.from, "P")} - {format(field.value.to, "P")}
                      </>
                    ) : (
                      format(field.value.from, "dd/MM/yyyy")
                    )
                  ) : (
                    <span className="text-gray-500">{placeholder || t("global.selectAPeriod")}</span>
                  )}
                  <Calendar1 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0" align="center">
              <Calendar mode="range" selected={field.value} onSelect={field.onChange} className="w-full" />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

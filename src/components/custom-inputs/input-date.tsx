"use client";

import * as React from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar1 } from "lucide-react";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function InputDateField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  rows = 3,
  required = false,
  disabled = false,
  className,
}: InputFieldProps<T>) {
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
                  {field.value ? format(field.value, "PPP") : placeholder}{" "}
                  <Calendar1 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={field.value} onSelect={field.onChange} />
            </PopoverContent>
          </Popover>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

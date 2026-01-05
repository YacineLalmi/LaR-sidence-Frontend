import React, { useCallback, useEffect, useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ListItem } from "@/schemas/global.schema";
import { cn } from "@/lib/utils";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;
  description?: string;
  options: ListItem[];
  revalidate?: number;
};
export default function InputSelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "",
  options = [],
  required,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full gap-[12px]">
          {!!label && (
            <FormLabel>
              {label} <span className={cn(" text-[16px]", required ? "text-red-500" : "text-transparent")}>*</span>
            </FormLabel>
          )}
          <Select onValueChange={val => field.onChange(val)} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {options.length > 0
                ? options.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.name}
                    </SelectItem>
                  ))
                : "no options"}
            </SelectContent>
          </Select>
          {!!description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

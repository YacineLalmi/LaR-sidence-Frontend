import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
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
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {!!label && (
            <FormLabel>
              {label} <span className={cn(" text-xl", required ? "text-red-500" : "text-transparent")}>*</span>
            </FormLabel>
          )}
          <FormControl>
            <Textarea placeholder="Enter a description..." className="resize-none" rows={100} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

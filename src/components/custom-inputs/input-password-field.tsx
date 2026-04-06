import React, { FormHTMLAttributes } from "react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues, FormProps } from "react-hook-form";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

export default function InputPasswordField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <FormLabel className="text-xs md:text-sm lg:text-base">
              {label} {required && <span className="text-red-500 text-xl mt-1">*</span>}
            </FormLabel>
          )}
          <FormControl>
            <Input type="password" disabled={disabled} required={required} placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

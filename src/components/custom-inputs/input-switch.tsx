import React from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export default function InputSwitch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  required = false,
  disabled = false,
  className,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem
          className={cn(
            "flex flex-row items-center justify-between rounded-xl border-1 p-4 transition-colors hover:bg-card",
            className,
          )}
        >
          <div className="space-y-1 pr-4">
            {label && (
              <FormLabel className="text-base font-medium cursor-pointer select-none">
                {label}
                {required && <span className="ml-1 text-destructive font-bold">*</span>}
              </FormLabel>
            )}
            {description && <FormDescription className="text-sm leading-relaxed">{description}</FormDescription>}
          </div>
          <FormControl>
            <div className="flex items-center">
              <Switch
                // Scaling the switch to 125% of its original size
                className={cn(
                  "scale-125 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
                  "transition-transform duration-200 cursor-pointer",
                )}
                checked={field.value}
                onCheckedChange={field.onChange}
                disabled={disabled}
              />
            </div>
          </FormControl>
        </FormItem>
      )}
    />
  );
}

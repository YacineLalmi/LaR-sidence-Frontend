import React from "react";
import { FormControl, FormField, FormItem, FormLabel } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;
  className?: string;
};

export default function InputSwitch<T extends FieldValues>({
  control,
  name,
  label,
  required = false,
  disabled = false,
  className,
}: InputFieldProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex flex-row items-center justify-between  p-4">
          <div className="space-y-0.5">
            {!!label && (
              <FormLabel>
                {label}{" "}
                <span className={cn(" text-xl", required ? "text-red-500" : "text-transparent", className)}>*</span>
              </FormLabel>
            )}
          </div>
          <FormControl>
            <Switch className="" checked={field.value} onCheckedChange={field.onChange} disabled={disabled} />
          </FormControl>
        </FormItem>
      )}
    />
  );
}

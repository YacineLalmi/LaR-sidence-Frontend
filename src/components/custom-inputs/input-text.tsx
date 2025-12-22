"use client";
import React from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues, FormProps } from "react-hook-form";
import { LucideIcon } from "lucide-react";
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
  RightIconOnClick?: () => any;
  className?: string;
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
          <FormControl>
            <div className="relative ">
              {LeftIcon && (
                <LeftIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              )}
              <Input
                disabled={disabled}
                placeholder={placeholder}
                className={cn(!!LeftIcon && "pl-8", !!RightIcon && "pr-8", "rounded-4xl", className)}
                {...field}
              />
              {RightIcon && (
                <RightIcon
                  className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                  onClick={RightIconOnClick}
                />
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

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
  errorInside?: boolean; // New boolean prop
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
  errorInside = false, // Default to false (under the input)
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
                className={cn(
                  !!LeftIcon && "pl-8",
                  !!RightIcon && "pr-8",
                  // Add extra padding-right if error is inside to prevent text overlap
                  errorInside && "pr-10",
                  className,
                )}
                {...field}
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

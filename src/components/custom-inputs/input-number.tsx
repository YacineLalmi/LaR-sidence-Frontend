"use client";
import React from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues, FormProps } from "react-hook-form";
import { LucideIcon, Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";

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
  showIcons?: boolean;
};

export default function InputNumberField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
  showIcons = false,
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
            <div className="relative ">
              {showIcons && (
                <Minus
                  onClick={() => field.onChange(Math.max((field.value || 0) - 1, 0))}
                  className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground  bg-black hover:bg-amber-300 transition duration-150 cursor-pointer rounded-full p-0.5"
                />
              )}
              <Input
                disabled={disabled}
                type="number"
                step="1"
                placeholder={placeholder}
                className={cn("rounded-4xl", showIcons && "px-12", className)}
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
              {showIcons && (
                <Plus
                  onClick={() => field.onChange((field.value || 0) + 1)}
                  className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground bg-black hover:bg-amber-300 transition duration-150 cursor-pointer rounded-full p-0.5"
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

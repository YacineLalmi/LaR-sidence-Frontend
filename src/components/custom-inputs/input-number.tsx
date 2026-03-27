"use client";
import React from "react";
import { Input } from "../ui/input";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Minus, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
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
      render={({ field }) => {
        const value = field.value ?? "";

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const val = e.target.value;

          // Allow only digits
          if (/^\d*$/.test(val)) {
            field.onChange(val);
          }
        };

        const increment = () => {
          const num = parseInt(value || "0", 10);
          field.onChange(String(num + 1));
        };

        const decrement = () => {
          const num = parseInt(value || "0", 10);
          field.onChange(String(Math.max(num - 1, 0)));
        };

        return (
          <FormItem className="w-full gap-[12px]">
            {!!label && (
              <FormLabel>
                {label} <span className={cn("text-xl", required ? "text-red-500" : "text-transparent")}>*</span>
              </FormLabel>
            )}

            <FormControl>
              <div className="relative">
                {showIcons && (
                  <Minus
                    onClick={decrement}
                    className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer rounded-full bg-black p-0.5 text-muted-foreground transition duration-150 hover:bg-amber-300"
                  />
                )}

                <Input
                  disabled={disabled}
                  type="text"
                  inputMode="numeric" // 📱 mobile numeric keyboard
                  pattern="[0-9]*"
                  placeholder={placeholder}
                  className={cn("rounded-4xl", showIcons && "px-12", className)}
                  value={value}
                  onChange={handleChange}
                />

                {showIcons && (
                  <Plus
                    onClick={increment}
                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 cursor-pointer rounded-full bg-black p-0.5 text-muted-foreground transition duration-150 hover:bg-amber-300"
                  />
                )}
              </div>
            </FormControl>

            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

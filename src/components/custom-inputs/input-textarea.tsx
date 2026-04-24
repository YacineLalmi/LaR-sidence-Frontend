"use client";

import React, { useState } from "react";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { cn } from "@/lib/utils";
import { Bold, Italic, AlignLeft, AlignCenter, AlignRight } from "lucide-react";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  errorInside?: boolean;
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
  errorInside = false,
}: InputFieldProps<T>) {
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  const toggleFormat = (format: string) => {
    const newFormats = new Set(activeFormats);
    if (newFormats.has(format)) {
      newFormats.delete(format);
    } else {
      newFormats.add(format);
    }
    setActiveFormats(newFormats);
  };

  const formatButtons = [
    { id: "bold", icon: Bold, label: "Bold" },
    { id: "italic", icon: Italic, label: "Italic" },
    { id: "align-left", icon: AlignLeft, label: "Align Left" },
    { id: "align-center", icon: AlignCenter, label: "Align Center" },
    { id: "align-right", icon: AlignRight, label: "Align Right" },
  ];

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full gap-[12px]", errorInside ? "relative" : "")}>
          <div className="flex items-center gap-1">
            {!!label && (
              <FormLabel className="text-xs md:text-sm lg:text-base">
                {label} <span className={cn("text-[16px]", required ? "text-red-500" : "text-transparent")}>*</span>
              </FormLabel>
            )}
            <div className="flex items-center gap-0.5 ml-auto">
              {formatButtons.map((button) => {
                const Icon = button.icon;
                const isActive = activeFormats.has(button.id);
                return (
                  <button
                    key={button.id}
                    type="button"
                    onClick={() => toggleFormat(button.id)}
                    disabled={disabled}
                    className={cn(
                      "p-1.5 rounded hover:bg-gray-200 transition-colors",
                      isActive && "bg-gray-300",
                      disabled && "opacity-50 cursor-not-allowed",
                    )}
                    aria-label={button.label}
                  >
                    <Icon className="w-4 h-4" strokeWidth={3} />
                  </button>
                );
              })}
            </div>
          </div>

          <FormControl>
            <div className="relative rounded-lg border-1 overflow-hidden  ">
              {/* Textarea */}
              <textarea
                disabled={disabled}
                placeholder={placeholder || ""}
                className={cn(
                  "w-full p-3 h-full resize-none border-0 focus:outline-none focus:ring-0 bg-gray-100",
                  errorInside && "pb-8",
                  className,
                )}
                rows={rows}
                {...field}
              />

              {/* Error message inside */}
              {errorInside && (
                <div className="absolute right-3 bottom-2">
                  <FormMessage className="text-[10px] font-medium leading-none" />
                </div>
              )}
            </div>
          </FormControl>

          {/* Error message outside */}
          {!errorInside && <FormMessage />}
        </FormItem>
      )}
    />
  );
}

"use client";

import type React from "react";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { Input } from "../ui/input";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function InputFileLarge<T extends FieldValues>({ control, name }: InputFieldProps<T>) {
  return (
    <>
      <FormField
        control={control}
        name={name}
        render={({ field }) => (
          <FormItem>
            <FormLabel>Upload files</FormLabel>
            <FormControl>
              <Input
                type="file"
                multiple
                accept=".jpg,.jpeg,.png,.pdf"
                onChange={(e) => field.onChange(Array.from(e.target.files ?? []))}
              />
            </FormControl>
            <FormMessage />
            <div className="grid grid-cols-3 gap-4 mt-4">
              {field.value &&
                field.value.length > 0 &&
                field.value.map((file: any, index: number) => (
                  <div key={index} className="relative">
                    <img
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg border"
                    />
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();

                        const updatedFiles = field.value.filter((_: File, i: number) => i !== index);

                        field.onChange(updatedFiles);
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center text-sm hover:bg-destructive/80"
                    >
                      ×
                    </button>
                  </div>
                ))}
            </div>
          </FormItem>
        )}
      />
    </>
  );
}

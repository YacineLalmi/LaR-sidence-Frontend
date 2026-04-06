"use client";

import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldValues, Path } from "react-hook-form";

interface ColorPickerInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  disabled?: boolean;
  required?: boolean;
  placeholder?: string;
}

export default function InputColorField<T extends FieldValues>({
  control,
  name,
  label,
  disabled,
  required,
  placeholder,
}: ColorPickerInputProps<T>) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          <FormLabel>
            {label} {required && <span className="text-red-500">*</span>}
          </FormLabel>
          <FormControl>
            <div className="relative flex items-center">
              {/* Le sélecteur de couleur caché derrière une pastille */}
              <div className="absolute left-3 flex items-center justify-center">
                <input
                  type="color"
                  disabled={disabled}
                  {...field}
                  className="h-6 w-6 cursor-pointer border-none bg-transparent p-0 [WebkitAppearance:none] !rounded-full"
                />
              </div>

              {/* L'input texte qui affiche le code HEX */}
              <Input
                {...field}
                disabled={disabled}
                placeholder={placeholder || "#000000"}
                className="pl-12 uppercase font-mono" // Padding left pour laisser place à la pastille
                onChange={(e) => {
                  // Validation simple pour s'assurer que l'input reste un HEX valide si on tape au clavier
                  const val = e.target.value;
                  if (val.startsWith("#") || val === "") {
                    field.onChange(val);
                  }
                }}
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

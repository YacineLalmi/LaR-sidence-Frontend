import React, { useCallback, useEffect, useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { LucideIcon } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;
  description?: string;
  optionsEndPoint: string;
  revalidate?: number;
};
export default function InputSelectFieldFetch<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "",
  optionsEndPoint,
  required,
  revalidate = 60 * 5,
}: InputFieldProps<T>) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [options, setOptions] = useState<{ id: number; name: string }[]>([]);
  const [hasError, setHasError] = useState<boolean>(false);

  console.log("optionsEndPoint", optionsEndPoint);
  console.log("hasError", hasError);
  console.log("isLoading", isLoading);

  const loadOptions = useCallback(async () => {
    setHasError(false);
    setIsLoading(true);
    try {
      const result = await fetch(optionsEndPoint, { cache: "force-cache", next: { revalidate } }).then((res) =>
        res.json()
      );
      console.log("resulllt", result);
      setOptions(result);
    } catch (error) {
      setHasError(true);
      console.error("erroorrrrr", error);
    }
    setIsLoading(false);
  }, [optionsEndPoint]);

  useEffect(() => {
    return () => {
      setOptions([]);
      setIsLoading(false);
      setHasError(false);
    };
  }, []);
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full">
          {!!label && (
            <FormLabel>
              {label} {required && <span className="text-red-500 text-xl mt-1">*</span>}
            </FormLabel>
          )}
          <Select
            onOpenChange={(open) => {
              if (open && options.length === 0) {
                loadOptions();
              }
            }}
            onValueChange={field.onChange}
            defaultValue={field.value}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {hasError && <div className="p-2 text-sm text-red-500">Failed to load options</div>}
              {!hasError && isLoading && <div className="p-2 text-sm">Loading...</div>}
              {!hasError && !isLoading && options.length === 0 && <div className="p-2 text-sm">No options found</div>}
              {!hasError &&
                !isLoading &&
                options.length > 0 &&
                options.map((option) => (
                  <SelectItem key={option.id} value={option.id.toString()}>
                    {option.name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {!!description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

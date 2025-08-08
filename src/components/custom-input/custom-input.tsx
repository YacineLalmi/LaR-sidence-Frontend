import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";
import { Switch } from "../ui/switch";

interface Props {
  id: string;
  name: string;
  type?: "text" | "textarea" | "number" | "hidden" | "checkbox" | "password" | "select";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  value?: string | number;
  error?: string | undefined;
  inputClassName?: string;
  containerClassName?: string;
  checked?: boolean;
  selectOptions?: { label: string; value: string | number | undefined }[];
}

export default function CustomInput({
  id,
  name,
  type,
  placeholder,
  disabled,
  required,
  label,
  value,
  error,
  inputClassName,
  containerClassName,
  checked,
  selectOptions,
}: Props) {
  switch (type) {
    case "textarea":
      return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
          <Label htmlFor="name">{label}</Label>
          <Textarea
            id={id}
            defaultValue={value}
            className={cn("p-5 rounded-4xl", inputClassName)}
            name={name}
            placeholder={placeholder || "Entrez une valeur"}
            disabled={disabled}
            required={required}
          />
          <span className="text-sm text-red-500">{error}</span>
        </div>
      );

    case "checkbox":
      return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
          <Label htmlFor="name">{label}</Label>
          <Switch
            id={id}
            name={name}
            defaultChecked={checked}
            disabled={disabled}
            className={cn(inputClassName)}
            onChange={() => (checked = !checked)}
          />
          <span className="text-sm text-red-500">{error}</span>
        </div>
      );

    case "select":
      return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
          <Label htmlFor={id}>{label}</Label>
          <select
            id={id}
            name={name}
            defaultValue={value}
            disabled={disabled}
            required={required}
            className={cn("p-5 rounded-4xl border-2 border-black", inputClassName)}
          >
            {placeholder && <option value="">{placeholder}</option>}
            {selectOptions?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <span className="text-sm text-red-500">{error}</span>
        </div>
      );

    default:
      return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
          {type !== "hidden" && <Label htmlFor="name">{label}</Label>}
          <Input
            id={id}
            defaultValue={value}
            className={cn("p-5 rounded-4xl border-2 border-black", inputClassName)}
            type={type || "text"}
            name={name}
            placeholder={placeholder || "Entrez une valeur"}
            disabled={disabled}
            required={required}
          />
          <span className="text-sm text-red-500">{error}</span>
        </div>
      );
  }
}

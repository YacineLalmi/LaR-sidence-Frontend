import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { cn } from "@/lib/utils";

interface Props {
  id: string;
  name: string;
  type?: "text" | "textarea" | "number" | "hidden";
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  value?: string | number;
  error?: string | undefined;
  inputClassName?: string;
  containerClassName?: string;
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

    default:
      return (
        <div className={cn("flex flex-col gap-2", containerClassName)}>
          {type !== "hidden" && <Label htmlFor="name">{label}</Label>}
          <Input
            id={id}
            defaultValue={value}
            className={cn("p-5 rounded-4xl", inputClassName)}
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

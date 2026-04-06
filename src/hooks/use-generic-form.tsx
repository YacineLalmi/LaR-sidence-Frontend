// hooks/use-generic-form.ts
import { useForm, DefaultValues } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues } from "react-hook-form";
import type { ZodSchema } from "zod";

export function useGenericForm<T extends FieldValues>(schema: ZodSchema<T>, defaultValues: DefaultValues<T>) {
  return useForm<T>({
    resolver: zodResolver(schema as any),
    defaultValues,
  });
}

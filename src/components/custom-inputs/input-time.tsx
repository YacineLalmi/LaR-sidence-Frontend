"use client";

import * as React from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar1, Clock, Clock1 } from "lucide-react";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function InputTimeField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
}: InputFieldProps<T>) {
  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => (
        <FormItem className="grow-1">
          {!!label && (
            <FormLabel>
              {label}{" "}
              <span className={cn(" text-xl", required ? "text-red-500" : "text-transparent", className)}>*</span>
            </FormLabel>
          )}
          <FormControl>
            <div>
              <Label htmlFor="time-from" className="sr-only">
                Start Time
              </Label>
              <Input
                type="time"
                step="1"
                {...field}
                // className="appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
              />
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

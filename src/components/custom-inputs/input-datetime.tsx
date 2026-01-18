"use client";

import * as React from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar1, Clock } from "lucide-react";

type InputDateTimeFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function InputDateTimeField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
}: InputDateTimeFieldProps<T>) {
  const [time, setTime] = React.useState("12:00");

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        // Extract time from field value if it exists
        React.useEffect(() => {
          if (field.value) {
            const hours = field.value.getHours().toString().padStart(2, "0");
            const minutes = field.value.getMinutes().toString().padStart(2, "0");
            setTime(`${hours}:${minutes}`);
          }
        }, [field.value]);

        const handleDateSelect = (date: Date | undefined) => {
          if (!date) {
            field.onChange(undefined);
            return;
          }

          // Combine selected date with current time
          const [hours, minutes] = time.split(":");
          const newDate = new Date(date);
          newDate.setHours(parseInt(hours, 10));
          newDate.setMinutes(parseInt(minutes, 10));
          field.onChange(newDate);
        };

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newTime = e.target.value;
          setTime(newTime);

          if (field.value) {
            const [hours, minutes] = newTime.split(":");
            const newDate = new Date(field.value);
            newDate.setHours(parseInt(hours, 10));
            newDate.setMinutes(parseInt(minutes, 10));
            field.onChange(newDate);
          }
        };

        const formatDateTime = (date: Date) => {
          const dateStr = format(date, "PPP");
          const hours = date.getHours().toString().padStart(2, "0");
          const minutes = date.getMinutes().toString().padStart(2, "0");
          return `${dateStr} at ${hours}:${minutes}`;
        };

        return (
          <FormItem className="grow-1">
            {!!label && (
              <FormLabel>
                {label}{" "}
                <span className={cn("text-xl", required ? "text-red-500" : "text-transparent", className)}>*</span>
              </FormLabel>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    disabled={disabled}
                    variant="outline"
                    className={cn(
                      "relative p-4 rounded-full justify-start text-left font-normal bg-transparent border-gray-700",
                      !field.value ? "text-muted-foreground" : ""
                    )}
                  >
                    {field.value ? formatDateTime(field.value) : placeholder}{" "}
                    <Calendar1 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={field.value} onSelect={handleDateSelect} disabled={disabled} />
                <div className="p-3 border-t border-border">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={time}
                      onChange={handleTimeChange}
                      disabled={disabled}
                      className="h-9"
                    />
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}
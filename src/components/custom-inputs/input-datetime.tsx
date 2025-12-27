"use client";

import * as React from "react";
import { Controller, Control, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Calendar1, Clock } from "lucide-react";

type InputFieldProps<T extends FieldValues> = {
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
}: InputFieldProps<T>) {
  const [date, setDate] = React.useState<Date | undefined>();
  const [time, setTime] = React.useState<string>("");

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        // Initialize date and time from field value
        React.useEffect(() => {
          if (field.value) {
            const dateValue = field.value instanceof Date ? field.value : new Date(field.value);
            setDate(dateValue);
            setTime(format(dateValue, "HH:mm"));
          }
        }, [field.value]);

        const handleDateSelect = (selectedDate: Date | undefined) => {
          if (selectedDate) {
            setDate(selectedDate);
            // Combine date with existing time or default to 00:00
            const [hours, minutes] = time ? time.split(":") : ["00", "00"];
            const combined = new Date(selectedDate);
            combined.setHours(parseInt(hours), parseInt(minutes), 0, 0);
            field.onChange(combined);
          }
        };

        const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
          const newTime = e.target.value;
          setTime(newTime);
          if (date) {
            const [hours, minutes] = newTime.split(":");
            const combined = new Date(date);
            combined.setHours(parseInt(hours || "0"), parseInt(minutes || "0"), 0, 0);
            field.onChange(combined);
          }
        };

        return (
          <FormItem className="grow-1">
            {!!label && (
              <FormLabel>
                {label}{" "}
                <span className={cn(" text-xl", required ? "text-red-500" : "text-transparent", className)}>*</span>
              </FormLabel>
            )}
            <div className="flex gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      className={cn(
                        "relative p-4 rounded-full justify-start text-left font-normal bg-transparent border-gray-700 flex-1",
                        !date ? "text-muted-foreground" : ""
                      )}
                    >
                      {date ? format(date, "dd/MM/yyyy") : placeholder || "Sélectionnez une date"}{" "}
                      <Calendar1 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={date} onSelect={handleDateSelect} />
                </PopoverContent>
              </Popover>
              <div className="relative flex-1">
                <Clock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="time"
                  value={time}
                  onChange={handleTimeChange}
                  className="pl-8 rounded-full"
                  placeholder="HH:mm"
                />
              </div>
            </div>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}


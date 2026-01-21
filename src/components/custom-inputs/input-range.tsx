"use client";

import * as React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormItem, FormLabel, FormMessage, FormControl, FormField } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Calendar1, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS } from "@/i18n/translation-constants";

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function InputDateRangeField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  className,
}: InputFieldProps<T>) {
  const translation = useTranslations();
  const [open, setOpen] = React.useState(false);

  const formatDateForUrl = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "yyyy-MM-dd");
  };

  const formatDisplayDate = (date: Date | undefined) => {
    if (!date) return "";
    return format(date, "dd/MM/yyyy");
  };

  return (
    <FormField
      name={name}
      control={control}
      render={({ field }) => {
        const hasValue = field.value?.from || field.value?.to;

        const handleClear = (e: React.MouseEvent) => {
          e.stopPropagation();
          field.onChange({ from: undefined, to: undefined });
        };

        const getDisplayValue = () => {
          if (!field.value) return null;

          const { from, to } = field.value;

          if (from && to) {
            return `${formatDisplayDate(from)} - ${formatDisplayDate(to)}`;
          } else if (from) {
            return `${translation(TRANSLATIONS_KEYS.COMMON.FROM)}: ${formatDisplayDate(from)}`;
          } else if (to) {
            return `${translation(TRANSLATIONS_KEYS.COMMON.TO)}: ${formatDisplayDate(to)}`;
          }

          return null;
        };

        const displayValue = getDisplayValue();

        return (
          <FormItem className="grow-1">
            {!!label && (
              <FormLabel>
                {label}{" "}
                <span className={cn("text-xl", required ? "text-red-500" : "text-transparent", className)}>*</span>
              </FormLabel>
            )}
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    disabled={disabled}
                    className={cn(
                      "relative w-full p-4 rounded-full justify-start text-left font-normal bg-transparent border-gray-700",
                      !displayValue && "text-muted-foreground"
                    )}
                  >
                    {displayValue || (
                      <span className="text-gray-500">
                        {placeholder || translation(TRANSLATIONS_KEYS.COMMON.SELECT_A_PERIOD)}
                      </span>
                    )}
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {hasValue && (
                        <X
                          className="h-4 w-4 text-muted-foreground hover:text-foreground cursor-pointer"
                          onClick={handleClear}
                        />
                      )}
                      <Calendar1 className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="range"
                  selected={field.value}
                  onSelect={(range) => {
                    // Only update if range is different from current value
                    if (range?.from && range?.to && range.from.getTime() === range.to.getTime()) {
                      // First date selected - only set 'from'
                      field.onChange({ from: range.from, to: undefined });
                    } else {
                      // Range selected or cleared
                      field.onChange(range);
                      // Close popover only if both dates are selected and different
                      if (range?.from && range?.to) {
                        setOpen(false);
                      }
                    }
                  }}
                  numberOfMonths={2}
                  disabled={disabled}
                />
                <div className="p-3 border-t flex justify-between items-center">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      field.onChange({ from: undefined, to: undefined });
                      setOpen(false);
                    }}
                  >
                    {translation(TRANSLATIONS_KEYS.COMMON.CLEAR_FILTERS)}
                  </Button>
                  <Button type="button" size="sm" onClick={() => setOpen(false)} disabled={!hasValue}>
                    {translation(TRANSLATIONS_KEYS.COMMON.APPLY)}
                  </Button>
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

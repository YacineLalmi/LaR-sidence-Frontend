"use client";

import { useState } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { Loader2, Check, ChevronDown, ChevronUp, X } from "lucide-react"; // Added X icon
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { ListItem } from "@/schemas/global.schema";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { TRANSLATIONS_KEYS_2 } from "@/i18n/translation-keys";

type InputSelectFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  description?: string;
  options: ListItem[];
  isPending?: boolean;
  className?: string;
  clearable?: boolean;
};

export default function InputSelectField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "Select an option",
  options = [],
  required = false,
  disabled = false,
  isPending = false,
  className,
  clearable = true, // Default to true
}: InputSelectFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const translation = useTranslations();

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full flex flex-col gap-1.5", className)}>
          {!!label && (
            <FormLabel className="text-xs md:text-sm lg:text-base font-medium">
              {label}
              <span className={cn("ml-1 text-[16px]", required ? "text-red-500" : "text-transparent")}>*</span>
            </FormLabel>
          )}

          <div className="relative group">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled || isPending}
                    className={cn(
                      "w-full justify-between bg-background font-normal transition-all focus:ring-2 border-1 border-black pr-10", // Added padding right
                      !field.value && "text-muted-foreground",
                    )}
                  >
                    <div className="flex items-center gap-2 overflow-hidden">
                      {isPending && <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0" />}
                      <span className="truncate">
                        {isPending
                          ? translation(TRANSLATIONS_KEYS_2.COMMON.MESSAGES.LOADING)
                          : options.find((opt) => opt.id.toString() === field.value?.toString())?.name || placeholder}
                      </span>
                    </div>
                    {open ? (
                      <ChevronUp className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    ) : (
                      <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                  </Button>
                </FormControl>
              </PopoverTrigger>

              <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Rechercher..." />
                  <CommandList>
                    {isPending ? (
                      <div className="flex items-center justify-center py-6 gap-2 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin text-primary" />
                        <span>Chargement des données...</span>
                      </div>
                    ) : (
                      <>
                        <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                        <CommandGroup>
                          {options.map((option) => (
                            <CommandItem
                              key={option.id}
                              value={option.name}
                              onSelect={() => {
                                field.onChange(option.id.toString());
                                setOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  option.id.toString() === field.value?.toString() ? "opacity-100" : "opacity-0",
                                )}
                              />
                              {option.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            {/* Clear Button Logic */}
            {clearable && field.value && !disabled && !isPending && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  field.onChange("");
                }}
                className="absolute right-9 top-1/2 -translate-y-1/2 p-1 hover:bg-secondary rounded-md transition-colors z-10 cursor-pointer"
              >
                <X className="h-3.5 w-3.5 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>

          {!!description && <FormDescription className="text-[11px]">{description}</FormDescription>}
          <FormMessage className="text-[11px] font-medium" />
        </FormItem>
      )}
    />
  );
}

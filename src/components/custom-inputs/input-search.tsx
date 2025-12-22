"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Search, Loader2, LucideIcon } from "lucide-react";
import { searchClientAction } from "@/actions/clients/search.action";
import { ListItem } from "@/schemas/Global.schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Control, FieldPath, FieldValues } from "react-hook-form";

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;
  RightIconOnClick?: () => any;
  className?: string;
}
export function InputSearchField<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  required = false,
  disabled = false,
  LeftIcon,
  RightIcon,
  RightIconOnClick,
  className,
}: InputFieldProps<T>) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [choosenClient, setChoosenClient] = useState<ListItem | null>();

  useEffect(() => {
    if (!query.trim()) {
      setChoosenClient(null);
      setResults([]);
      return;
    }

    setIsLoading(true);

    const debounceTimer = setTimeout(async () => {
      const clients = await searchClientAction(query);
      setResults(clients);
      setIsLoading(false);
    }, 2000); // 2 second debounce

    return () => {
      clearTimeout(debounceTimer);
    };
  }, [query]);

  const handleClientChange = useCallback((client: ListItem) => {
    setChoosenClient(client);
    setQuery(client.name);
    setResults([]);
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full gap-[12px]">
          {!!label && (
            <FormLabel>
              {label} <span className={cn(" text-[16px]", required ? "text-red-500" : "text-transparent")}>*</span>
            </FormLabel>
          )}
          <FormControl>
            <div className="relative ">
              <Input type="text" placeholder={placeholder} {...field} disabled={disabled} required={required} />
              {isLoading && (
                <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
              )}

              {results.length > 0 && (
                <div className="rounded-lg border border-border bg-card absolute z-10 mt-2 w-full">
                  {results.map((client) => (
                    <div
                      key={client.id}
                      className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleClientChange(client)}
                    >
                      <span className="font-medium text-foreground">{client.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {query.trim() && !isLoading && results.length === 0 && (
                <div className="rounded-lg border border-border bg-card absolute z-10">
                  <p className="lex flex-col gap-1 border-b border-border p-4 last:border-b-0 hover:bg-muted/50 transition-colors w-full">
                    No clients found matching "{query}"
                  </p>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

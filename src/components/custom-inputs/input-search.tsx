"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { LucideIcon, Plus } from "lucide-react";
import { ListItem } from "@/schemas/global.schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import FormDialog from "../form-dialog/form-dialog";
import CustomButton from "../ui/custom-button";
import CreateClientForm from "@/app/(protected)/clients/add/_components/create-client-form";

interface InputFieldProps<T extends FieldValues> {
  control: Control<T>;
  name: FieldPath<T>;
  options: ListItem[];
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
  options,
}: InputFieldProps<T>) {
  const [query, setQuery] = useState("");
  const [selectedClient, setSelectedClient] = useState<ListItem | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Filter options based on query
  const filteredResults = useMemo(() => {
    if (!query.trim() || selectedClient) {
      return [];
    }

    const lowerQuery = query.toLowerCase();
    return options.filter((option) => option.name.toLowerCase().includes(lowerQuery));
  }, [query, options, selectedClient]);

  // Initialize with existing value
  useEffect(() => {
    if (!isInitialized && options.length > 0) {
      const fieldValue = control._formValues[name];

      if (fieldValue) {
        const existingClient = options.find((option) => option.id === fieldValue);
        if (existingClient) {
          setSelectedClient(existingClient);
          setQuery(existingClient.name);
        }
      }
      setIsInitialized(true);
    }
  }, [options, control._formValues, name, isInitialized]);

  const handleClientSelect = useCallback((client: ListItem, onChange: (value: any) => void) => {
    setSelectedClient(client);
    setQuery(client.name);
    setShowResults(false);
    // Set the ID in the form field
    onChange(client.id);
  }, []);

  const handleInputChange = useCallback((value: string, onChange: (value: any) => void) => {
    setQuery(value);
    setSelectedClient(null);
    setShowResults(true);
    // Clear the form field value when user types
    onChange("");
  }, []);

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="w-full gap-[12px]">
          {!!label && (
            <FormLabel>
              {label} <span className={cn("text-[16px]", required ? "text-red-500" : "text-transparent")}>*</span>
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <div className="flex gap-1">
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value, field.onChange)}
                  disabled={disabled}
                  required={required}
                  onFocus={() => {
                    if (filteredResults.length > 0) {
                      setShowResults(true);
                    }
                  }}
                  onBlur={() => {
                    // Delay hiding results to allow click to register
                    setTimeout(() => setShowResults(false), 200);
                  }}
                />
                <FormDialog
                  isOpen={isOpen}
                  onOpenChange={setIsOpen}
                  title="create a client"
                  submitButtonText="sub"
                  trigger={<CustomButton Icon={Plus} size="icon" className="!p-0" />}
                  isPending={false}
                  formId="ssss"
                  maxWidth={768}
                >
                  <CreateClientForm civilities={[]} sources={[]} status={[]} types={[]} />
                </FormDialog>
              </div>
              {showResults && filteredResults.length > 0 && (
                <div className="rounded-lg border border-border bg-card absolute z-10 mt-2 w-full shadow-lg max-h-60 overflow-y-auto">
                  {filteredResults.map((client) => (
                    <div
                      key={client.id}
                      className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleClientSelect(client, field.onChange)}
                    >
                      <span className="font-medium text-foreground">{client.name}</span>
                    </div>
                  ))}
                </div>
              )}

              {query.trim() && !selectedClient && filteredResults.length === 0 && (
                <div className="rounded-lg border border-border bg-card absolute z-10 mt-2 w-full shadow-lg">
                  <p className="flex flex-col gap-1 border-b border-border p-4 last:border-b-0 text-muted-foreground">
                    No clients found matching "{query}"
                  </p>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
          {/* Hidden input to store the actual ID value */}
          <input type="hidden" {...field} />
        </FormItem>
      )}
    />
  );
}

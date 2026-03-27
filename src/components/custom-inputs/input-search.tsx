"use client";

import { useState, useEffect, useCallback, useMemo, ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { LucideIcon, Plus } from "lucide-react";
import { ListItem } from "@/schemas/global.schema";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { cn } from "@/lib/utils";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import FormDialog from "../form-dialog/form-dialog";
import CustomButton from "../ui/custom-button";

interface InputSearchFieldProps<T extends FieldValues> {
  // Form props
  control: Control<T>;
  name: FieldPath<T>;

  // Data props
  options: ListItem[];

  // Display props
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;

  // Icons
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;

  // Styling
  className?: string;
  inputClassName?: string;
  dropdownClassName?: string;

  // Custom rendering
  renderOption?: (option: ListItem) => ReactNode;
  renderNoResults?: (query: string) => ReactNode;

  // Search behavior
  filterFunction?: (option: ListItem, query: string) => boolean;
  minCharsToSearch?: number;

  // Create new item feature
  showCreateButton?: boolean;
  createButtonIcon?: LucideIcon;
  createButtonTooltip?: string;
  createDialogTitle?: string;
  createDialogSubmitText?: string;
  createDialogMaxWidth?: number;
  CreateFormComponent?: React.ComponentType<any>;
  createFormProps?: any;
  onCreateSuccess?: (newItem: ListItem) => void;

  // Callbacks
  onSelect?: (option: ListItem) => void;
  onChange?: (value: string) => void;
}

export function InputSearchField<T extends FieldValues>({
  control,
  name,
  options,
  label,
  placeholder = "Search...",
  required = false,
  disabled = false,
  LeftIcon,
  RightIcon,
  className,
  inputClassName,
  dropdownClassName,
  renderOption,
  renderNoResults,
  filterFunction,
  minCharsToSearch = 0,
  showCreateButton = false,
  createButtonIcon = Plus,
  createButtonTooltip,
  createDialogTitle = "Create New",
  createDialogSubmitText = "Submit",
  createDialogMaxWidth = 768,
  CreateFormComponent,
  createFormProps,
  onCreateSuccess,
  onSelect,
  onChange,
}: InputSearchFieldProps<T>) {
  const [query, setQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<ListItem | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Default filter function
  const defaultFilterFunction = useCallback((option: ListItem, searchQuery: string) => {
    return option.name.toLowerCase().includes(searchQuery.toLowerCase());
  }, []);

  const filterFn = filterFunction || defaultFilterFunction;

  // Filter options based on query
  const filteredResults = useMemo(() => {
    if (!query.trim() || selectedItem) {
      return [];
    }

    if (query.length < minCharsToSearch) {
      return [];
    }

    return options.filter((option) => filterFn(option, query));
  }, [query, options, selectedItem, filterFn, minCharsToSearch]);

  // Initialize with existing value
  useEffect(() => {
    if (!isInitialized && options.length > 0) {
      const fieldValue = control._formValues[name];

      if (fieldValue) {
        const existingItem = options.find((option) => option.id === fieldValue);
        if (existingItem) {
          setSelectedItem(existingItem);
          setQuery(existingItem.name);
        }
      }
      setIsInitialized(true);
    }
  }, [options, control._formValues, name, isInitialized]);

  const handleItemSelect = useCallback(
    (item: ListItem, onFieldChange: (value: any) => void) => {
      setSelectedItem(item);
      setQuery(item.name);
      setShowResults(false);
      onFieldChange(item.id);
      onSelect?.(item);
    },
    [onSelect],
  );

  const handleInputChange = useCallback(
    (value: string, onFieldChange: (value: any) => void) => {
      setQuery(value);
      setSelectedItem(null);
      setShowResults(true);
      onFieldChange(null);
      onChange?.(value);
    },
    [onChange],
  );

  const handleCreateSuccess = useCallback(
    (newItem: ListItem) => {
      setIsCreateDialogOpen(false);
      onCreateSuccess?.(newItem);
      // Optionally auto-select the newly created item
      if (newItem) {
        setSelectedItem(newItem);
        setQuery(newItem.name);
      }
    },
    [onCreateSuccess],
  );

  // Default option renderer
  const defaultRenderOption = useCallback((option: ListItem) => {
    return (
      <div className="flex flex-col gap-1">
        <span className="font-medium text-foreground">{option.name}</span>
      </div>
    );
  }, []);

  // Default no results renderer
  const defaultRenderNoResults = useCallback((searchQuery: string) => {
    return <p className="text-muted-foreground">No results found matching "{searchQuery}"</p>;
  }, []);

  const optionRenderer = renderOption || defaultRenderOption;
  const noResultsRenderer = renderNoResults || defaultRenderNoResults;

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={cn("w-full gap-[12px]", className)}>
          {!!label && (
            <FormLabel>
              {label} <span className={cn("text-[16px]", required ? "text-red-500" : "text-transparent")}>*</span>
            </FormLabel>
          )}
          <FormControl>
            <div className="relative">
              <div className="flex gap-1 items-center">
                {LeftIcon && (
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <LeftIcon className="h-4 w-4" />
                  </div>
                )}

                <Input
                  type="text"
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => handleInputChange(e.target.value, field.onChange)}
                  disabled={disabled}
                  required={required}
                  className={cn(LeftIcon && "pl-10", RightIcon && "pr-10", inputClassName)}
                  onFocus={() => {
                    if (filteredResults.length > 0) {
                      setShowResults(true);
                    }
                  }}
                  onBlur={() => {
                    setTimeout(() => setShowResults(false), 200);
                  }}
                />

                {RightIcon && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    <RightIcon className="h-4 w-4" />
                  </div>
                )}

                {showCreateButton && CreateFormComponent && (
                  <FormDialog
                    isOpen={isCreateDialogOpen}
                    onOpenChange={setIsCreateDialogOpen}
                    title={createDialogTitle}
                    submitButtonText={createDialogSubmitText}
                    trigger={
                      <CustomButton Icon={createButtonIcon} size="icon" className="!p-0" text={createButtonTooltip} />
                    }
                    isPending={false}
                    formId="create-form"
                    maxWidth={createDialogMaxWidth}
                  >
                    <CreateFormComponent {...createFormProps} onSuccess={handleCreateSuccess} />
                  </FormDialog>
                )}
              </div>

              {/* Results dropdown */}
              {showResults && filteredResults.length > 0 && (
                <div
                  className={cn(
                    "rounded-lg border border-border bg-card absolute z-10 mt-2 w-full shadow-lg max-h-60 overflow-y-auto",
                    dropdownClassName,
                  )}
                >
                  {filteredResults.map((option) => (
                    <div
                      key={option.id}
                      className="border-b border-border p-4 last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleItemSelect(option, field.onChange)}
                    >
                      {optionRenderer(option)}
                    </div>
                  ))}
                </div>
              )}

              {/* No results message */}
              {query.trim() && !selectedItem && filteredResults.length === 0 && query.length >= minCharsToSearch && (
                <div className="rounded-lg border border-border bg-card absolute z-10 mt-2 w-full shadow-lg">
                  <div className="border-b border-border p-4 last:border-b-0">{noResultsRenderer(query)}</div>
                </div>
              )}
            </div>
          </FormControl>
          <FormMessage />
          <input type="hidden" {...field} />
        </FormItem>
      )}
    />
  );
}

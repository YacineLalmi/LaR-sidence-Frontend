import React, { useCallback, useEffect, useState, useTransition } from "react";
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { LucideIcon, Search, Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { ListItem } from "@/schemas/global.schema";
import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { useDebounce } from "@/hooks/use-debounce.hook"; // We'll create this

type InputFieldProps<T extends FieldValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  LeftIcon?: LucideIcon;
  RightIcon?: LucideIcon;
  description?: string;
  // Server action for fetching options
  fetchOptions: (search: string) => Promise<ListItem[]>;
  // Optional initial options
  initialOptions?: ListItem[];
  // Debounce delay in ms
  debounceMs?: number;
  // Search placeholder
  searchPlaceholder?: string;
};

export default function InputSelectFetchField<T extends FieldValues>({
  control,
  name,
  label,
  description,
  placeholder = "",
  required,
  disabled,
  fetchOptions,
  initialOptions = [],
  debounceMs = 500,
  searchPlaceholder = "Search...",
}: InputFieldProps<T>) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [options, setOptions] = useState<ListItem[]>(initialOptions);
  const [isPending, startTransition] = useTransition();

  const debouncedSearch = useDebounce(search, debounceMs);

  // Fetch options when debounced search changes
  useEffect(() => {
    if (!open && !initialOptions) return;

    startTransition(async () => {
      try {
        const results = await fetchOptions(debouncedSearch);
        setOptions(results);
      } catch (error) {
        console.error("Failed to fetch options:", error);
        setOptions([]);
      }
    });
  }, [debouncedSearch, fetchOptions, open]);

  // Load initial options when dropdown opens
  const handleOpenChange = useCallback(
    (isOpen: boolean) => {
      setOpen(isOpen);
      if (isOpen && options.length === 0) {
        startTransition(async () => {
          try {
            const results = await fetchOptions("");
            setOptions(results);
          } catch (error) {
            console.error("Failed to fetch initial options:", error);
          }
        });
      }
      // Reset search when closing
      if (!isOpen) {
        setSearch("");
      }
    },
    [fetchOptions, options.length],
  );

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
          <Select
            onValueChange={(val) => field.onChange(val)}
            defaultValue={field.value}
            onOpenChange={handleOpenChange}
            open={open}
            disabled={disabled}
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {/* Search Input */}
              <div className="flex items-center border-b px-3 pb-2">
                <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                <Input
                  placeholder={searchPlaceholder}
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                  // Prevent select from closing when typing
                  onKeyDown={(e) => e.stopPropagation()}
                />
                {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin opacity-50" />}
              </div>

              {/* Options List */}
              <div className="max-h-[300px] overflow-y-auto">
                {isPending && options.length === 0 ? (
                  <div className="py-6 text-center text-sm text-muted-foreground">Loading...</div>
                ) : options.length > 0 ? (
                  options.map((option) => (
                    <SelectItem key={option.id} value={option.id.toString()}>
                      {option.name}
                    </SelectItem>
                  ))
                ) : (
                  <div className="py-6 text-center text-sm text-muted-foreground">
                    {search ? "No results found" : "No options available"}
                  </div>
                )}
              </div>
            </SelectContent>
          </Select>
          {!!description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}

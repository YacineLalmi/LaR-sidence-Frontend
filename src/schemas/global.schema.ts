import z from "zod";

export const SearchFormSchema = z.object({
  search: z.string(),
});

export type SearchForm = z.infer<typeof SearchFormSchema>;

export const ListItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export type ListItem = z.infer<typeof ListItemSchema>;

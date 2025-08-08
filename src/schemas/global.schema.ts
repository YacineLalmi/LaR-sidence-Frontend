import z from "zod";

// export const MultiLangSchema = z.object({
//   ar: z.string(),
//   fr: z.string(),
//   en: z.string(),
// });
export const MultiLangSchema = z.string();

export type MultiLang = z.infer<typeof MultiLangSchema>;

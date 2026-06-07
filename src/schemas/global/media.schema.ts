import z from "zod"

export const MediaSchema = z.object({
    id: z.string(),
    uuid: z.string(),
    name: z.string(),
    file_name: z.string(),
    mime_type: z.string(),
    size: z.number(),
})

export type Media = z.infer<typeof MediaSchema>
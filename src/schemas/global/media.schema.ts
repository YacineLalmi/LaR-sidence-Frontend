import z from "zod"

export const MediaSchema = z.object({
    id: z.string(),
    uuid: z.string(),
    collection_name: z.string(),
    name: z.string(),
    file_name: z.string(),
    mime_type: z.string(),
    size: z.number(),
    created_at: z.iso.datetime(),
    updated_at: z.iso.datetime(),
})

export type Media = z.infer<typeof MediaSchema>
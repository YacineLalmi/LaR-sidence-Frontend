"use server";

import { Media } from "@/schemas/global/media.schema";
import { MediaService } from "@/services/media.service";

export async function getMediaAsBlobAction(media: Media): Promise<{ base64: string; name: string; mimeType: string; uuid: string } | null> {

    try {
        const blob = await MediaService.getMediaAsBlob(media.uuid);
        // Convert Blob to an ArrayBuffer, then to a Buffer
        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        // Convert to Base64 string
        const base64 = buffer.toString("base64");

        return {
            uuid: media.uuid,
            base64,
            name: media.name,
            mimeType: media.mime_type,
        };

    } catch (error) {
        console.error(error);
        return null;
    }
}

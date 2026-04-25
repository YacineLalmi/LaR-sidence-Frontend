"use server";

import { MediaService } from "@/services/media.service";

export async function getMediaAsBlobAction(uuid: string): Promise<Blob | null> {

    try {
        return await MediaService.getMediaAsBlob(uuid);

    } catch (error) {
        console.error(error);
        return null;
    }
}

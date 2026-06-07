import ApiService from "./api.service";

const END_POINTS = {
    getMediaAsBlob: (uuid: string) => `/media/${uuid}`,
};

export const MediaService = {
    getMediaAsBlob: async (uuid: string, conversion: string = "default") => {
        const fileAsBlob = await ApiService.downloadFile({
            endpoint: END_POINTS.getMediaAsBlob(uuid),
            query: { conversion }
        });

        return fileAsBlob;
    },
};

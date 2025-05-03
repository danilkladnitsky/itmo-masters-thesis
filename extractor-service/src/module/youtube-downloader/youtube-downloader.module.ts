import ytdl from "ytdl-core"
import type { IYoutubeDownloaderModule } from "./types"

export const createYoutubeDownloaderModule = (): IYoutubeDownloaderModule => {
    return {
        extractCaptions: async (videoUrl: string) => {
            try {
                const info = await ytdl.getInfo(videoUrl);
                const captions = info.player_response.captions;

                if (!captions) {
                    throw new Error("No captions found");
                }
            
                const captionTracks = captions.playerCaptionsTracklistRenderer.captionTracks;

                return captionTracks;
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
}
import { YoutubeLoader } from "@langchain/community/document_loaders/web/youtube";
import type { IYoutubeCaptionsModule } from "./types"

export const createYoutubeCaptionsModule = (): IYoutubeCaptionsModule => {
    return {
        extractCaptions: async (videoUrl: string) => {
            try {
                const loader = YoutubeLoader.createFromUrl(videoUrl, {
                    language: "zh-CN",
                  });
              
                const docs = await loader.load();
                
                return docs[0].pageContent
            } catch (error) {
                console.error(error);
                throw error;
            }
        }
    }
}
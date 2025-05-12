import type { TextGenerateInput } from "@/module/text-generator/types";
import type { CreateDatasetController, IDatasetController } from "./types";
import type { DatasetResources, PromptResource, YoutubeVideoResource } from "@/common/types";


export const createDatasetController = ({imageScannerModule, textGeneratorModule, s3Module, youtubeCaptionsModule}: CreateDatasetController): IDatasetController => {
    const processYoutubeVideos = async (videoUrlList: YoutubeVideoResource[]) => {
        const captions = await Promise.all(videoUrlList.map(async (video) => {
            const captions = await youtubeCaptionsModule.extractCaptions(video.url);
            
            console.log(captions);
        }));
        return captions;
    }

    const processPrompts = async (promptList: PromptResource[], hskLevel: number) => {
        const prompts = await Promise.all(promptList.map(async ({ text }) => {
            const input: TextGenerateInput = {
                hsk: hskLevel,
                extraInstructions: text,
            }
            const prompt = await textGeneratorModule.generateText(input);
            

            console.log(prompt);
        }));
        return prompts;
    }
    return {
        createDataset: async (request) => {
            const payload = await request.json();
            const { modelName, modelDescription, hskLevel, promptList, videoUrlList, images } = payload as DatasetResources;

            const captions = videoUrlList ? await processYoutubeVideos(videoUrlList) : [];
            const prompts = promptList ? await processPrompts(promptList, hskLevel) : [];

            return new Response("Dataset created", { status: 200 });
        }
    }
}
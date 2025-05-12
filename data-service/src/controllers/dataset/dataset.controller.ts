
import type { TextGenerateInput } from "@/module/text-generator/types";
import type { CreateDatasetController, IDatasetController } from "./types";
import type { DatasetResources, PromptResource, YoutubeVideoResource } from "@/common/types";
import { v4 as uuidv4 } from 'uuid';

export const createDatasetController = ({imageScannerModule, textGeneratorModule, s3Module, youtubeCaptionsModule}: CreateDatasetController): IDatasetController => {
    const processYoutubeVideos = async (videoUrlList: YoutubeVideoResource[], modelName: string) => {
        await Promise.all(videoUrlList.map(async (video) => {
            const captions = await youtubeCaptionsModule.extractCaptions(video.url);
            const filename = `${modelName}/${uuidv4()}.txt`;

            s3Module.uploadTextFile(filename, captions);
        }));

    }

    const processPrompts = async (promptList: PromptResource[], hskLevel: number, modelName: string) => {
        await Promise.all(promptList.map(async ({ text }) => {
            const input: TextGenerateInput = {
                hsk: hskLevel,
                extraInstructions: text,
            }
            const result = await textGeneratorModule.generateText(input);

            if (!result.ok) {
                console.error("Failed to generate text");
                return;
            }

            const filename = `${modelName}/${uuidv4()}.txt`;

            s3Module.uploadTextFile(filename, result.content);
        }));
    }
    return {
        createDataset: async (request) => {
            const payload = await request.json();
            const { modelName, modelDescription, hskLevel, promptList, videoUrlList, images } = payload as DatasetResources;

            const folderName = `${modelName}/${uuidv4()}`;

            if (videoUrlList?.length) {
                await processYoutubeVideos(videoUrlList, folderName);
            }

            if (promptList?.length) {
                await processPrompts(promptList, hskLevel, folderName);
            }

            return new Response("Dataset created", { status: 200 });
        }
    }
}
import type { ITextGeneratorModule } from "@/module/text-generator/types";

export type CreateExtractController = {
    textGeneratorModule: ITextGeneratorModule;
}

export interface IExtractController {
    generateText: (request: Request) => Promise<Response>;
}
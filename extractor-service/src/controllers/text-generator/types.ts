import type { ITextGeneratorModule } from "@/module/text-generator/types";

export type CreateGeneratorController = {
    textGeneratorModule: ITextGeneratorModule;
}

export interface IGeneratorController {
    generateText: (request: Request) => Promise<Response>;
}
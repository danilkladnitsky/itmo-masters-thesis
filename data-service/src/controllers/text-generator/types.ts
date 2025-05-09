import type { IS3Module } from "@/module/s3/types";
import type { ITextGeneratorModule } from "@/module/text-generator/types";

export type CreateGeneratorController = {
    textGeneratorModule: ITextGeneratorModule;
    s3Module: IS3Module;
}

export interface IGeneratorController {
    generateText: (request: Request) => Promise<Response>;
}
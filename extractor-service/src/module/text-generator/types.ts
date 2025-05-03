import type { IAgent } from "@/agents/types";
import type { LLMOptions, LLMOutput } from "@/common/types";

export type TextGenerateInput = {
    hsk: number;
    subject?: string;
    options?: Partial<LLMOptions>;
}

export interface ITextGeneratorModule {
    generateText: (text: TextGenerateInput) => Promise<LLMOutput>;
}

export type CreateTextGeneratorModule = {
    agent: IAgent;

}
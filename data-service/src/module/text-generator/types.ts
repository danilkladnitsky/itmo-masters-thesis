import type { IAgent } from "@/agents/types";
import type { LLMOptions, LLMOutput } from "@/common/types";

export type TextGenerateInput = {
    hsk: number;
    subject?: string;
    extraInstructions?: string;
    options?: Partial<LLMOptions>;
    iterations?: number;
}

export interface ITextGeneratorModule {
    generateText: (text: TextGenerateInput) => Promise<LLMOutput>;
}

export type CreateTextGeneratorModule = {
    agent: IAgent;

}
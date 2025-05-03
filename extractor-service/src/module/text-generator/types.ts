import type { IAgent } from "@/agents/types";
import type { LLMOutput } from "@/common/types";

export type TextGenerateInput = {
    hsk: number;
    subject?: string;
}

export interface ITextGeneratorModule {
    generateText: (text: TextGenerateInput) => Promise<LLMOutput>;
}

export type CreateTextGeneratorModule = {
    agent: IAgent;

}